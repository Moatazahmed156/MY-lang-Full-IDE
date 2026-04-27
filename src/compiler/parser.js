// MZ-Lang Parser
// Converts token stream into an AST

import { TokenType } from './lexer.js';

export class ParseError extends Error {
  constructor(message, line) {
    super(message);
    this.line = line;
    this.name = 'ParseError';
  }
}

class Parser {
  constructor(tokens) {
    this.tokens = tokens.filter(t => t.type !== TokenType.EOF || true);
    this.pos = 0;
    this.errors = [];
  }

  peek() { return this.tokens[this.pos] || { type: TokenType.EOF, value: '', line: -1 }; }
  prev() { return this.tokens[this.pos - 1] || { type: TokenType.EOF, value: '', line: -1 }; }

  at(offset = 0) { return this.tokens[this.pos + offset] || { type: TokenType.EOF, value: '', line: -1 }; }

  isEOF() { return this.peek().type === TokenType.EOF; }

  advance() {
    const t = this.peek();
    if (!this.isEOF()) this.pos++;
    return t;
  }

  expect(type, value) {
    const t = this.peek();
    if (t.type !== type || (value !== undefined && t.value !== value)) {
      const msg = `Expected ${value !== undefined ? `'${value}'` : type} but got '${t.value}' (${t.type}) at line ${t.line}`;
      this.errors.push({ message: msg, line: t.line });
      // try to recover by skipping
      return t;
    }
    return this.advance();
  }

  check(type, value) {
    const t = this.peek();
    return t.type === type && (value === undefined || t.value === value);
  }

  match(type, value) {
    if (this.check(type, value)) { this.advance(); return true; }
    return false;
  }

  // ─── Grammar ─────────────────────────────────────────────

  parse() {
    const body = [];
    // optional "main { ... }"
    if (this.check(TokenType.KEYWORD, 'main')) {
      this.advance();
      this.expect(TokenType.PUNCTUATION, '{');
      while (!this.isEOF() && !this.check(TokenType.PUNCTUATION, '}')) {
        const stmt = this.statement();
        if (stmt) body.push(stmt);
      }
      this.expect(TokenType.PUNCTUATION, '}');
    } else {
      while (!this.isEOF()) {
        const stmt = this.statement();
        if (stmt) body.push(stmt);
      }
    }
    return { type: 'Program', body, line: 1 };
  }

  statement() {
    const t = this.peek();

    if (t.type === TokenType.EOF) return null;

    // Variable declaration: number x = 5
    if (t.type === TokenType.KEYWORD && ['number', 'text', 'boolean'].includes(t.value)) {
      return this.varDecl();
    }

    // Array declaration: Array name = [...]
    if (t.type === TokenType.KEYWORD && t.value === 'Array') {
      return this.arrayDecl();
    }

    // If statement
    if (t.type === TokenType.KEYWORD && t.value === 'if') {
      return this.ifStmt();
    }

    // While loop
    if (t.type === TokenType.KEYWORD && t.value === 'while') {
      return this.whileStmt();
    }

    // Print statement
    if (t.type === TokenType.KEYWORD && t.value === 'print') {
      return this.printStmt();
    }

    // Block
    if (t.type === TokenType.PUNCTUATION && t.value === '{') {
      return this.block();
    }

    // Assignment: x = expr
    if (t.type === TokenType.IDENTIFIER && this.at(1).type === TokenType.OPERATOR && this.at(1).value === '=') {
      return this.assignStmt();
    }

    // Index assignment: arr[i] = expr
    if (t.type === TokenType.IDENTIFIER && this.at(1).type === TokenType.PUNCTUATION && this.at(1).value === '[') {
      return this.exprStmt();
    }

    // Expression statement
    return this.exprStmt();
  }

  varDecl() {
    const typeToken = this.advance();
    const name = this.expect(TokenType.IDENTIFIER);
    let init = null;
    if (this.match(TokenType.OPERATOR, '=')) {
      init = this.expression();
    }
    this.match(TokenType.PUNCTUATION, ';');
    return { type: 'VarDecl', varType: typeToken.value, name: name.value, init, line: typeToken.line };
  }

  arrayDecl() {
    const tok = this.advance(); // Array
    const name = this.expect(TokenType.IDENTIFIER);
    let elements = [];
    if (this.match(TokenType.OPERATOR, '=')) {
      this.expect(TokenType.PUNCTUATION, '[');
      while (!this.isEOF() && !this.check(TokenType.PUNCTUATION, ']')) {
        elements.push(this.expression());
        this.match(TokenType.PUNCTUATION, ',');
      }
      this.expect(TokenType.PUNCTUATION, ']');
    }
    this.match(TokenType.PUNCTUATION, ';');
    return { type: 'ArrayDecl', name: name.value, elements, line: tok.line };
  }

  ifStmt() {
    const tok = this.advance(); // if
    this.expect(TokenType.PUNCTUATION, '(');
    const condition = this.expression();
    this.expect(TokenType.PUNCTUATION, ')');
    const consequent = this.block();
    let alternate = null;
    if (this.check(TokenType.KEYWORD, 'else')) {
      this.advance();
      if (this.check(TokenType.KEYWORD, 'if')) {
        alternate = this.ifStmt();
      } else {
        alternate = this.block();
      }
    }
    return { type: 'IfStmt', condition, consequent, alternate, line: tok.line };
  }

  whileStmt() {
    const tok = this.advance(); // while
    this.expect(TokenType.PUNCTUATION, '(');
    const condition = this.expression();
    this.expect(TokenType.PUNCTUATION, ')');
    const body = this.block();
    return { type: 'WhileStmt', condition, body, line: tok.line };
  }

  printStmt() {
    const tok = this.advance(); // print
    this.expect(TokenType.PUNCTUATION, '(');
    const args = [];
    while (!this.isEOF() && !this.check(TokenType.PUNCTUATION, ')')) {
      args.push(this.expression());
      this.match(TokenType.PUNCTUATION, ',');
    }
    this.expect(TokenType.PUNCTUATION, ')');
    this.match(TokenType.PUNCTUATION, ';');
    return { type: 'PrintStmt', args, line: tok.line };
  }

  assignStmt() {
    const name = this.advance();
    this.advance(); // =
    const value = this.expression();
    this.match(TokenType.PUNCTUATION, ';');
    return { type: 'Assign', name: name.value, value, line: name.line };
  }

  exprStmt() {
    const expr = this.expression();
    this.match(TokenType.PUNCTUATION, ';');
    return { type: 'ExprStmt', expr, line: expr?.line };
  }

  block() {
    const tok = this.expect(TokenType.PUNCTUATION, '{');
    const body = [];
    while (!this.isEOF() && !this.check(TokenType.PUNCTUATION, '}')) {
      const stmt = this.statement();
      if (stmt) body.push(stmt);
    }
    this.expect(TokenType.PUNCTUATION, '}');
    return { type: 'Block', body, line: tok.line };
  }

  // ─── Expressions ─────────────────────────────────────────

  expression() { return this.logical(); }

  logical() {
    let left = this.comparison();
    while (this.check(TokenType.OPERATOR, '&&') || this.check(TokenType.OPERATOR, '||') ||
           this.check(TokenType.KEYWORD, 'and') || this.check(TokenType.KEYWORD, 'or')) {
      const op = this.advance();
      const right = this.comparison();
      left = { type: 'BinaryExpr', op: op.value, left, right, line: op.line };
    }
    return left;
  }

  comparison() {
    let left = this.additive();
    const CMP_OPS = ['>', '<', '>=', '<=', '==', '!='];
    while (this.peek().type === TokenType.OPERATOR && CMP_OPS.includes(this.peek().value)) {
      const op = this.advance();
      const right = this.additive();
      left = { type: 'BinaryExpr', op: op.value, left, right, line: op.line };
    }
    return left;
  }

  additive() {
    let left = this.multiplicative();
    while (this.check(TokenType.OPERATOR, '+') || this.check(TokenType.OPERATOR, '-')) {
      const op = this.advance();
      const right = this.multiplicative();
      left = { type: 'BinaryExpr', op: op.value, left, right, line: op.line };
    }
    return left;
  }

  multiplicative() {
    let left = this.unary();
    while (this.check(TokenType.OPERATOR, '*') || this.check(TokenType.OPERATOR, '/') || this.check(TokenType.OPERATOR, '%')) {
      const op = this.advance();
      const right = this.unary();
      left = { type: 'BinaryExpr', op: op.value, left, right, line: op.line };
    }
    return left;
  }

  unary() {
    if (this.check(TokenType.OPERATOR, '!') || this.check(TokenType.KEYWORD, 'not')) {
      const op = this.advance();
      const operand = this.unary();
      return { type: 'UnaryExpr', op: op.value, operand, line: op.line };
    }
    if (this.check(TokenType.OPERATOR, '-')) {
      const op = this.advance();
      const operand = this.unary();
      return { type: 'UnaryExpr', op: '-', operand, line: op.line };
    }
    return this.primary();
  }

  primary() {
    const t = this.peek();

    // Number literal
    if (t.type === TokenType.NUMBER) {
      this.advance();
      return { type: 'Literal', kind: 'number', value: parseFloat(t.value), line: t.line };
    }

    // String literal
    if (t.type === TokenType.STRING) {
      this.advance();
      return { type: 'Literal', kind: 'string', value: t.value, line: t.line };
    }

    // Boolean literal
    if (t.type === TokenType.BOOLEAN) {
      this.advance();
      return { type: 'Literal', kind: 'boolean', value: t.value === 'true', line: t.line };
    }

    // Grouped expression
    if (t.type === TokenType.PUNCTUATION && t.value === '(') {
      this.advance();
      const expr = this.expression();
      this.expect(TokenType.PUNCTUATION, ')');
      return expr;
    }

    // Array literal
    if (t.type === TokenType.PUNCTUATION && t.value === '[') {
      this.advance();
      const elements = [];
      while (!this.isEOF() && !this.check(TokenType.PUNCTUATION, ']')) {
        elements.push(this.expression());
        this.match(TokenType.PUNCTUATION, ',');
      }
      this.expect(TokenType.PUNCTUATION, ']');
      return { type: 'ArrayLiteral', elements, line: t.line };
    }

    // Identifier, function call, or index access
    if (t.type === TokenType.IDENTIFIER) {
      this.advance();
      // Function call
      if (this.check(TokenType.PUNCTUATION, '(')) {
        this.advance();
        const args = [];
        while (!this.isEOF() && !this.check(TokenType.PUNCTUATION, ')')) {
          args.push(this.expression());
          this.match(TokenType.PUNCTUATION, ',');
        }
        this.expect(TokenType.PUNCTUATION, ')');
        return { type: 'FuncCall', name: t.value, args, line: t.line };
      }
      // Index access
      if (this.check(TokenType.PUNCTUATION, '[')) {
        this.advance();
        const index = this.expression();
        this.expect(TokenType.PUNCTUATION, ']');
        // check for assignment
        if (this.check(TokenType.OPERATOR, '=')) {
          this.advance();
          const value = this.expression();
          this.match(TokenType.PUNCTUATION, ';');
          return { type: 'IndexAssign', name: t.value, index, value, line: t.line };
        }
        return { type: 'IndexExpr', name: t.value, index, line: t.line };
      }
      return { type: 'Identifier', name: t.value, line: t.line };
    }

    // Unknown — skip to avoid infinite loop
    this.errors.push({ message: `Unexpected token '${t.value}' (${t.type})`, line: t.line });
    this.advance();
    return { type: 'Literal', kind: 'number', value: 0, line: t.line };
  }
}

export function parser(tokens) {
  const p = new Parser(tokens);
  const ast = p.parse();
  return { ast, errors: p.errors };
}
