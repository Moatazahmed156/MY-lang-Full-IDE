// MZ-Lang Executor
// Interprets the AST and produces program output

class ExecutionError extends Error {
  constructor(message, line) {
    super(message);
    this.line = line;
    this.name = 'ExecutionError';
  }
}

class Environment {
  constructor(parent = null) {
    this.vars = {};
    this.parent = parent;
  }

  get(name) {
    if (name in this.vars) return this.vars[name];
    if (this.parent) return this.parent.get(name);
    throw new ExecutionError(`Undefined variable '${name}'`);
  }

  set(name, value) {
    if (name in this.vars) { this.vars[name] = value; return; }
    if (this.parent && this.parent.has(name)) { this.parent.set(name, value); return; }
    this.vars[name] = value;
  }

  define(name, value) { this.vars[name] = value; }

  has(name) {
    if (name in this.vars) return true;
    if (this.parent) return this.parent.has(name);
    return false;
  }
}

class Interpreter {
  constructor() {
    this.output = [];
    this.globalEnv = new Environment();
    this.stepLimit = 100000;
    this.steps = 0;
  }

  log(value, type = 'out') {
    this.output.push({ value: String(value), type });
  }

  checkSteps() {
    this.steps++;
    if (this.steps > this.stepLimit) {
      throw new ExecutionError('Infinite loop or execution limit exceeded (100000 steps)');
    }
  }

  run(node, env = this.globalEnv) {
    if (!node) return null;
    this.checkSteps();

    switch (node.type) {
      case 'Program':
        this.log('▶ Program started', 'sys');
        for (const stmt of node.body) {
          this.run(stmt, env);
        }
        this.log('■ Program finished', 'sys');
        return null;

      case 'Block': {
        const blockEnv = new Environment(env);
        for (const stmt of node.body) {
          const result = this.run(stmt, blockEnv);
          if (result && result.__return) return result;
        }
        return null;
      }

      case 'VarDecl': {
        const val = node.init ? this.eval(node.init, env) : this.defaultValue(node.varType);
        env.define(node.name, val);
        return null;
      }

      case 'ArrayDecl': {
        const elements = node.elements.map(e => this.eval(e, env));
        env.define(node.name, elements);
        return null;
      }

      case 'Assign': {
        const val = this.eval(node.value, env);
        if (!env.has(node.name)) {
          throw new ExecutionError(`Undeclared variable '${node.name}'`, node.line);
        }
        env.set(node.name, val);
        return null;
      }

      case 'IndexAssign': {
        const arr = env.get(node.name);
        if (!Array.isArray(arr)) throw new ExecutionError(`'${node.name}' is not an array`, node.line);
        const idx = this.eval(node.index, env);
        const val = this.eval(node.value, env);
        arr[idx] = val;
        return null;
      }

      case 'IfStmt': {
        const cond = this.eval(node.condition, env);
        if (this.isTruthy(cond)) {
          return this.run(node.consequent, env);
        } else if (node.alternate) {
          return this.run(node.alternate, env);
        }
        return null;
      }

      case 'WhileStmt': {
        let iterations = 0;
        while (this.isTruthy(this.eval(node.condition, env))) {
          this.checkSteps();
          iterations++;
          if (iterations > 10000) throw new ExecutionError('While loop exceeded 10000 iterations (possible infinite loop)', node.line);
          const result = this.run(node.body, env);
          if (result && result.__break) break;
          if (result && result.__return) return result;
        }
        return null;
      }

      case 'PrintStmt': {
        const parts = node.args.map(a => this.formatValue(this.eval(a, env)));
        this.log(parts.join(' '), 'out');
        return null;
      }

      case 'ExprStmt':
        this.eval(node.expr, env);
        return null;

      default:
        return null;
    }
  }

  eval(node, env) {
    if (!node) return null;
    this.checkSteps();

    switch (node.type) {
      case 'Literal':
        return node.value;

      case 'Identifier':
        return env.get(node.name);

      case 'ArrayLiteral':
        return node.elements.map(e => this.eval(e, env));

      case 'IndexExpr': {
        const arr = env.get(node.name);
        if (!Array.isArray(arr)) throw new ExecutionError(`'${node.name}' is not an array`, node.line);
        const idx = this.eval(node.index, env);
        if (idx < 0 || idx >= arr.length) throw new ExecutionError(`Index ${idx} out of bounds for '${node.name}' (length ${arr.length})`, node.line);
        return arr[idx];
      }

      case 'BinaryExpr': {
        const left = this.eval(node.left, env);
        const right = this.eval(node.right, env);
        return this.applyOp(node.op, left, right);
      }

      case 'UnaryExpr': {
        const val = this.eval(node.operand, env);
        if (node.op === '-') return -Number(val);
        if (node.op === '!' || node.op === 'not') return !this.isTruthy(val);
        return val;
      }

      case 'FuncCall': {
        // Built-in functions
        const args = node.args.map(a => this.eval(a, env));
        return this.callBuiltin(node.name, args, node.line);
      }

      case 'IndexAssign': {
        const arr = env.get(node.name);
        const idx = this.eval(node.index, env);
        const val = this.eval(node.value, env);
        arr[idx] = val;
        return val;
      }

      default:
        return null;
    }
  }

  applyOp(op, left, right) {
    switch (op) {
      case '+':
        if (typeof left === 'string' || typeof right === 'string')
          return String(left) + String(right);
        return Number(left) + Number(right);
      case '-': return Number(left) - Number(right);
      case '*': return Number(left) * Number(right);
      case '/':
        if (Number(right) === 0) throw new ExecutionError('Division by zero');
        return Number(left) / Number(right);
      case '%': return Number(left) % Number(right);
      case '>': return Number(left) > Number(right);
      case '<': return Number(left) < Number(right);
      case '>=': return Number(left) >= Number(right);
      case '<=': return Number(left) <= Number(right);
      case '==': return left == right; // intentional loose equality
      case '!=': return left != right;
      case '&&':
      case 'and': return this.isTruthy(left) && this.isTruthy(right);
      case '||':
      case 'or': return this.isTruthy(left) || this.isTruthy(right);
      default: return null;
    }
  }

  callBuiltin(name, args, line) {
    switch (name) {
      case 'print':
        this.log(args.map(a => this.formatValue(a)).join(' '), 'out');
        return null;
      case 'length':
      case 'len':
        if (Array.isArray(args[0])) return args[0].length;
        if (typeof args[0] === 'string') return args[0].length;
        throw new ExecutionError(`len() expects array or string`, line);
      case 'str':
      case 'toString':
        return String(args[0]);
      case 'num':
      case 'toNumber':
        return Number(args[0]);
      case 'bool':
        return Boolean(args[0]);
      case 'push':
        if (!Array.isArray(args[0])) throw new ExecutionError('push() expects array as first arg', line);
        args[0].push(args[1]);
        return args[0].length;
      case 'pop':
        if (!Array.isArray(args[0])) throw new ExecutionError('pop() expects array', line);
        return args[0].pop();
      case 'sqrt':
        return Math.sqrt(Number(args[0]));
      case 'abs':
        return Math.abs(Number(args[0]));
      case 'floor':
        return Math.floor(Number(args[0]));
      case 'ceil':
        return Math.ceil(Number(args[0]));
      case 'round':
        return Math.round(Number(args[0]));
      case 'max':
        return Math.max(...args.map(Number));
      case 'min':
        return Math.min(...args.map(Number));
      case 'pow':
        return Math.pow(Number(args[0]), Number(args[1]));
      case 'random':
        return Math.random();
      default:
        throw new ExecutionError(`Unknown function '${name}'`, line);
    }
  }

  isTruthy(val) {
    if (val === null || val === undefined || val === false || val === 0 || val === '') return false;
    return true;
  }

  defaultValue(type) {
    if (type === 'number') return 0;
    if (type === 'text') return '';
    if (type === 'boolean') return false;
    if (type === 'Array') return [];
    return null;
  }

  formatValue(val) {
    if (val === null || val === undefined) return 'null';
    if (Array.isArray(val)) return `[${val.map(v => this.formatValue(v)).join(', ')}]`;
    if (typeof val === 'boolean') return val ? 'true' : 'false';
    if (typeof val === 'number') {
      if (Number.isInteger(val)) return String(val);
      return val.toFixed(6).replace(/\.?0+$/, '');
    }
    return String(val);
  }
}

export function execute(ast) {
  const interp = new Interpreter();
  try {
    interp.run(ast);
    return { output: interp.output, error: null };
  } catch (e) {
    interp.output.push({ value: `RuntimeError: ${e.message}`, type: 'err' });
    return { output: interp.output, error: e.message };
  }
}
