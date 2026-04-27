import { lexer } from './lexer.js';
import { parser } from './parser.js';
import { semantic } from './semantic.js';
import { codegen } from './codegen.js';
import { execute } from './executor.js';

export function runPipeline(code) {
  const result = {
    tokens: [],
    lexerErrors: [],
    ast: null,
    parserErrors: [],
    symbolTable: [],
    semanticErrors: [],
    semanticWarnings: [],
    assembly: [],
    output: [],
    executionError: null,
    stage: 'none',
  };

  try {
    // Stage 1: Lexer
    const lexResult = lexer(code);
    result.tokens = lexResult.tokens;
    result.lexerErrors = lexResult.errors;
    result.stage = 'lexer';

    // Stage 2: Parser
    const parseResult = parser(lexResult.tokens);
    result.ast = parseResult.ast;
    result.parserErrors = parseResult.errors;
    result.stage = 'parser';

    if (parseResult.errors.length > 0 && !parseResult.ast) {
      return result;
    }

    // Stage 3: Semantic
    const semResult = semantic(parseResult.ast);
    result.symbolTable = semResult.symbolTable;
    result.semanticErrors = semResult.errors;
    result.semanticWarnings = semResult.warnings;
    result.stage = 'semantic';

    // Stage 4: Code Gen
    result.assembly = codegen(parseResult.ast);
    result.stage = 'codegen';

    // Stage 5: Execute
    const execResult = execute(parseResult.ast);
    result.output = execResult.output;
    result.executionError = execResult.error;
    result.stage = 'execute';

  } catch (e) {
    result.executionError = e.message;
  }

  return result;
}

export function runStage(code, upToStage) {
  const stages = ['lexer', 'parser', 'semantic', 'codegen', 'execute'];
  const idx = stages.indexOf(upToStage);
  const result = { tokens: [], ast: null, symbolTable: [], assembly: [], output: [], errors: [], stage: upToStage };

  try {
    const lexResult = lexer(code);
    result.tokens = lexResult.tokens;
    result.lexerErrors = lexResult.errors;
    if (idx < 1) return result;

    const parseResult = parser(lexResult.tokens);
    result.ast = parseResult.ast;
    result.parserErrors = parseResult.errors;
    if (idx < 2) return result;

    const semResult = semantic(parseResult.ast);
    result.symbolTable = semResult.symbolTable;
    result.semanticErrors = semResult.errors;
    result.semanticWarnings = semResult.warnings;
    if (idx < 3) return result;

    result.assembly = codegen(parseResult.ast);
    if (idx < 4) return result;

    const execResult = execute(parseResult.ast);
    result.output = execResult.output;
    result.executionError = execResult.error;
  } catch (e) {
    result.error = e.message;
  }

  return result;
}

export { lexer, parser, semantic, codegen, execute };
