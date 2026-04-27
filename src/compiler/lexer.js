// MZ-Lang Lexer
// Converts source code into a flat list of tokens

export const TokenType = {
  KEYWORD: 'KEYWORD',
  IDENTIFIER: 'IDENTIFIER',
  NUMBER: 'NUMBER',
  STRING: 'STRING',
  BOOLEAN: 'BOOLEAN',
  OPERATOR: 'OPERATOR',
  PUNCTUATION: 'PUNCTUATION',
  EOF: 'EOF',
  UNKNOWN: 'UNKNOWN',
};

const KEYWORDS = new Set([
  'main', 'number', 'text', 'boolean', 'if', 'else', 'while',
  'print', 'true', 'false', 'Array', 'return', 'and', 'or', 'not',
]);

const OPERATORS = new Set([
  '+', '-', '*', '/', '%', '>', '<', '>=', '<=', '==', '!=',
  '=', '!', '&&', '||',
]);

export function lexer(code) {
  const tokens = [];
  let i = 0;
  let line = 1;
  const errors = [];

  while (i < code.length) {
    const ch = code[i];

    // Newlines
    if (ch === '\n') { line++; i++; continue; }

    // Whitespace
    if (/\s/.test(ch)) { i++; continue; }

    // Single-line comment
    if (ch === '/' && code[i + 1] === '/') {
      while (i < code.length && code[i] !== '\n') i++;
      continue;
    }

    // Multi-line comment
    if (ch === '/' && code[i + 1] === '*') {
      i += 2;
      while (i < code.length && !(code[i] === '*' && code[i + 1] === '/')) {
        if (code[i] === '\n') line++;
        i++;
      }
      i += 2;
      continue;
    }

    // String literal
    if (ch === '"' || ch === "'") {
      const quote = ch;
      let value = '';
      i++;
      while (i < code.length && code[i] !== quote) {
        if (code[i] === '\\' && i + 1 < code.length) {
          const esc = code[i + 1];
          if (esc === 'n') value += '\n';
          else if (esc === 't') value += '\t';
          else value += esc;
          i += 2;
        } else {
          value += code[i++];
        }
      }
      i++; // closing quote
      tokens.push({ type: TokenType.STRING, value, line });
      continue;
    }

    // Number
    if (/[0-9]/.test(ch) || (ch === '-' && /[0-9]/.test(code[i + 1]) && (tokens.length === 0 || ['OPERATOR', 'PUNCTUATION'].includes(tokens[tokens.length - 1]?.type)))) {
      let value = '';
      if (ch === '-') { value += '-'; i++; }
      while (i < code.length && /[0-9.]/.test(code[i])) value += code[i++];
      tokens.push({ type: TokenType.NUMBER, value, line });
      continue;
    }

    // Identifier / Keyword / Boolean
    if (/[a-zA-Z_]/.test(ch)) {
      let value = '';
      while (i < code.length && /[a-zA-Z0-9_]/.test(code[i])) value += code[i++];
      if (value === 'true' || value === 'false') {
        tokens.push({ type: TokenType.BOOLEAN, value, line });
      } else if (KEYWORDS.has(value)) {
        tokens.push({ type: TokenType.KEYWORD, value, line });
      } else {
        tokens.push({ type: TokenType.IDENTIFIER, value, line });
      }
      continue;
    }

    // Multi-char operators
    if (i + 1 < code.length && OPERATORS.has(ch + code[i + 1])) {
      tokens.push({ type: TokenType.OPERATOR, value: ch + code[i + 1], line });
      i += 2;
      continue;
    }

    // Single-char operators
    if (OPERATORS.has(ch)) {
      tokens.push({ type: TokenType.OPERATOR, value: ch, line });
      i++;
      continue;
    }

    // Punctuation
    if ('{}()[];,[]'.includes(ch)) {
      tokens.push({ type: TokenType.PUNCTUATION, value: ch, line });
      i++;
      continue;
    }

    // Unknown
    errors.push({ message: `Unknown character '${ch}'`, line });
    tokens.push({ type: TokenType.UNKNOWN, value: ch, line });
    i++;
  }

  tokens.push({ type: TokenType.EOF, value: '', line });
  return { tokens, errors };
}
