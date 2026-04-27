// MZ-Lang Semantic Analyzer
// Validates the AST: type checking, symbol resolution, scope management

class Scope {
  constructor(parent = null) {
    this.parent = parent;
    this.symbols = {};
  }

  define(name, info) {
    this.symbols[name] = info;
  }

  lookup(name) {
    if (name in this.symbols) return this.symbols[name];
    if (this.parent) return this.parent.lookup(name);
    return null;
  }

  has(name) { return name in this.symbols; }
}

class SemanticAnalyzer {
  constructor() {
    this.globalScope = new Scope();
    this.currentScope = this.globalScope;
    this.errors = [];
    this.warnings = [];
    this.symbolTable = []; // flat list for display
  }

  error(message, line) {
    this.errors.push({ message, line });
  }

  warning(message, line) {
    this.warnings.push({ message, line });
  }

  pushScope() {
    this.currentScope = new Scope(this.currentScope);
  }

  popScope() {
    this.currentScope = this.currentScope.parent;
  }

  defineSymbol(name, varType, line, value = null) {
    if (this.currentScope.has(name)) {
      this.error(`Variable '${name}' is already declared in this scope`, line);
      return;
    }
    const info = { name, varType, line, value };
    this.currentScope.define(name, info);
    this.symbolTable.push(info);
  }

  analyzeNode(node) {
    if (!node) return null;

    switch (node.type) {
      case 'Program':
        node.body.forEach(s => this.analyzeNode(s));
        return 'void';

      case 'Block':
        this.pushScope();
        node.body.forEach(s => this.analyzeNode(s));
        this.popScope();
        return 'void';

      case 'VarDecl': {
        let initType = null;
        if (node.init) {
          initType = this.analyzeNode(node.init);
          // Type coercion check
          const declared = node.varType;
          if (initType && !this.typesCompatible(declared, initType)) {
            this.warning(`Type mismatch: declared '${declared}' but assigned '${initType}' for '${node.name}'`, node.line);
          }
        }
        this.defineSymbol(node.name, node.varType, node.line, node.init);
        return 'void';
      }

      case 'ArrayDecl': {
        node.elements.forEach(e => this.analyzeNode(e));
        this.defineSymbol(node.name, 'Array', node.line);
        return 'void';
      }

      case 'Assign': {
        const sym = this.currentScope.lookup(node.name);
        if (!sym) {
          this.error(`Undeclared variable '${node.name}'`, node.line);
        }
        const valType = this.analyzeNode(node.value);
        if (sym && valType && !this.typesCompatible(sym.varType, valType)) {
          this.warning(`Type mismatch: '${node.name}' is '${sym.varType}' but assigning '${valType}'`, node.line);
        }
        return 'void';
      }

      case 'IndexAssign': {
        const sym = this.currentScope.lookup(node.name);
        if (!sym) this.error(`Undeclared array '${node.name}'`, node.line);
        this.analyzeNode(node.index);
        this.analyzeNode(node.value);
        return 'void';
      }

      case 'IfStmt':
        this.analyzeNode(node.condition);
        this.analyzeNode(node.consequent);
        if (node.alternate) this.analyzeNode(node.alternate);
        return 'void';

      case 'WhileStmt':
        this.analyzeNode(node.condition);
        this.analyzeNode(node.body);
        return 'void';

      case 'PrintStmt':
        node.args.forEach(a => this.analyzeNode(a));
        return 'void';

      case 'ExprStmt':
        return this.analyzeNode(node.expr);

      case 'BinaryExpr': {
        const l = this.analyzeNode(node.left);
        const r = this.analyzeNode(node.right);
        const cmpOps = ['>', '<', '>=', '<=', '==', '!=', '&&', '||', 'and', 'or'];
        if (cmpOps.includes(node.op)) return 'boolean';
        if (l === 'text' || r === 'text') return 'text';
        return 'number';
      }

      case 'UnaryExpr':
        this.analyzeNode(node.operand);
        if (node.op === '!' || node.op === 'not') return 'boolean';
        return 'number';

      case 'Literal':
        if (node.kind === 'number') return 'number';
        if (node.kind === 'string') return 'text';
        if (node.kind === 'boolean') return 'boolean';
        return 'unknown';

      case 'Identifier': {
        const sym = this.currentScope.lookup(node.name);
        if (!sym) {
          this.error(`Undeclared variable '${node.name}'`, node.line);
          return 'unknown';
        }
        return sym.varType;
      }

      case 'IndexExpr': {
        const sym = this.currentScope.lookup(node.name);
        if (!sym) {
          this.error(`Undeclared array '${node.name}'`, node.line);
          return 'unknown';
        }
        this.analyzeNode(node.index);
        return 'unknown';
      }

      case 'FuncCall':
        node.args.forEach(a => this.analyzeNode(a));
        return 'unknown';

      case 'ArrayLiteral':
        node.elements.forEach(e => this.analyzeNode(e));
        return 'Array';

      default:
        return 'unknown';
    }
  }

  typesCompatible(declared, assigned) {
    if (declared === assigned) return true;
    if (declared === 'number' && assigned === 'number') return true;
    if (declared === 'text' && assigned === 'text') return true;
    if (declared === 'boolean' && assigned === 'boolean') return true;
    if (declared === 'Array' && assigned === 'Array') return true;
    // Allow number to text coercion (like most dynamic langs)
    if (declared === 'text') return true;
    return false;
  }
}

export function semantic(ast) {
  const analyzer = new SemanticAnalyzer();
  analyzer.analyzeNode(ast);
  return {
    symbolTable: analyzer.symbolTable,
    errors: analyzer.errors,
    warnings: analyzer.warnings,
  };
}
