export default function TutorialPage() {
  return (
    <div className="page-layout">
      <div className="page-content">
        <div className="page-hero">
          <div className="page-hero-badge">🎓 Tutorial</div>
          <h1 className="page-title">How <span>Compilers</span> Work</h1>
          <p className="page-subtitle">
            Learn how MY-Lang IDE transforms your source code into executable output —
            step by step through each phase of the compiler pipeline.
          </p>
        </div>

        {/* Pipeline overview */}
        <div className="doc-section">
          <h2 className="doc-section-title">The Compiler Pipeline</h2>
          <p>
            Every program you write goes through five distinct stages before producing output.
            Click <strong>Step Mode</strong> in the IDE to watch each stage execute one at a time.
          </p>
          <div className="pipeline-flow">
            <div className="pipeline-stage pipe-lexer">1 · Lexer</div>
            <span className="pipe-arrow">→</span>
            <div className="pipeline-stage pipe-parser">2 · Parser</div>
            <span className="pipe-arrow">→</span>
            <div className="pipeline-stage pipe-semantic">3 · Semantic</div>
            <span className="pipe-arrow">→</span>
            <div className="pipeline-stage pipe-codegen">4 · Code Gen</div>
            <span className="pipe-arrow">→</span>
            <div className="pipeline-stage pipe-execute">5 · Execute</div>
          </div>
        </div>

        {/* Step 1: Lexer */}
        <div className="doc-section">
          <div className="tutorial-step">
            <div className="tutorial-step-num">1</div>
            <div className="tutorial-step-content">
              <div className="tutorial-step-title">Lexical Analysis (Tokenizer)</div>
              <p>
                The <strong>lexer</strong> reads raw source code character by character and
                groups characters into <em>tokens</em> — the smallest meaningful units of the language.
                Think of it like reading a sentence and identifying individual words.
              </p>
              <p>
                For example, <code style={{color:'var(--token-ident)'}}>number x = 10</code> produces
                four tokens: a KEYWORD, an IDENTIFIER, an OPERATOR, and a NUMBER.
              </p>
              <div className="code-block">
                <div className="code-block-header"><span>Source → Tokens</span><span>example</span></div>
                <pre>
  <span className="cm">Source:  number x = 10 + 5</span>
  {"\n\n"}
  <span className="cm">Tokens:</span>
  {"\n"}
  KEYWORD     → "number"
  {"\n"}
  IDENTIFIER  → "x"
  {"\n"}
  OPERATOR    → "="
  {"\n"}
  NUMBER      → "10"
  {"\n"}
  OPERATOR    → "+"
  {"\n"}
  NUMBER      → "5"
</pre>
              </div>
              <p>
                The <strong>Tokens</strong> tab in the IDE shows you every token produced,
                along with its type, value, and source line number.
              </p>
            </div>
          </div>
        </div>

        {/* Step 2: Parser */}
        <div className="doc-section">
          <div className="tutorial-step">
            <div className="tutorial-step-num">2</div>
            <div className="tutorial-step-content">
              <div className="tutorial-step-title">Parsing (Syntax Analysis)</div>
              <p>
                The <strong>parser</strong> takes the flat list of tokens and builds a hierarchical
                tree structure called a <em>Parse Tree</em> or <em>AST</em> (Abstract Syntax Tree).
                It checks that the grammar rules of the language are followed.
              </p>
              <p>
                This is where syntax errors like missing braces or wrong keyword order are caught.
                The parser uses a technique called <em>recursive descent parsing</em>.
              </p>
              <div className="code-block">
                <div className="code-block-header"><span>Tokens → Parse Structure</span><span>example</span></div>
                <pre>
  <span className="cm">Tokens: if ( x &gt; 5 ) {"{ "}print("big"){" }"}</span>

  {"\n\n"}
  <span className="cm">Parsed as:</span>
  {"\n"}
  IfStmt
  {"\n"}
  ├── condition: BinaryExpr ( x &gt; 5 )
  {"\n"}
  │   ├── left: Identifier "x"
  {"\n"}
  │   ├── op: "&gt;"
  {"\n"}
  │   └── right: Literal 5
  {"\n"}
  └── consequent: Block
  {"\n"}
      └── PrintStmt
  {"\n"}
          └── args[0]: Literal "big"
</pre>
              </div>
              <p>
                The <strong>Parser</strong> tab shows the full AST as JSON.
                The <strong>AST</strong> tab renders it as an interactive tree you can expand and collapse.
              </p>
            </div>
          </div>
        </div>

        {/* Step 3: Semantic */}
        <div className="doc-section">
          <div className="tutorial-step">
            <div className="tutorial-step-num">3</div>
            <div className="tutorial-step-content">
              <div className="tutorial-step-title">Semantic Analysis</div>
              <p>
                The <strong>semantic analyzer</strong> walks the AST and checks for <em>meaning</em>,
                not just structure. Even if code is syntactically valid, it might be semantically wrong.
              </p>
              <p>Common semantic checks include:</p>
              <ul style={{ marginLeft: 20, marginBottom: 12, color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.9 }}>
                <li><strong style={{color:'var(--token-ident)'}}>Undeclared variables</strong> — using a variable before declaring it</li>
                <li><strong style={{color:'var(--token-ident)'}}>Type mismatches</strong> — assigning a string to a number variable</li>
                <li><strong style={{color:'var(--token-ident)'}}>Duplicate declarations</strong> — declaring the same variable twice</li>
                <li><strong style={{color:'var(--token-ident)'}}>Symbol table building</strong> — tracking every variable's name, type, and scope</li>
              </ul>
              <div className="code-block">
                <div className="code-block-header"><span>Semantic Error Examples</span><span>my-lang</span></div>
                <pre>
  <span className="cm">// Error: undeclared variable</span>
  {"\n"}
  <span className="fn">print</span>(<span className="id">undeclaredVar</span>)   <span className="cm">// ✖ 'undeclaredVar' not found</span>

  {"\n\n"}
  <span className="cm">// Error: duplicate declaration</span>
  {"\n"}
  <span className="kw">number</span> <span className="id">x</span> <span className="op">=</span> <span className="num">5</span>
  {"\n"}
  <span className="kw">number</span> <span className="id">x</span> <span className="op">=</span> <span className="num">10</span>    <span className="cm">// ✖ 'x' already declared</span>
</pre>
              </div>
              <p>
                The <strong>Semantic</strong> tab shows the <em>Symbol Table</em> (all declared
                variables) and any semantic errors or warnings found.
              </p>
            </div>
          </div>
        </div>

        {/* Step 4: Code Gen */}
        <div className="doc-section">
          <div className="tutorial-step">
            <div className="tutorial-step-num">4</div>
            <div className="tutorial-step-content">
              <div className="tutorial-step-title">Code Generation</div>
              <p>
                The <strong>code generator</strong> traverses the validated AST and produces
                low-level instructions. In real compilers this would be machine code or bytecode.
                MY-Lang produces a human-readable <em>pseudo-assembly</em> format for educational purposes.
              </p>
              <div className="code-block">
                <div className="code-block-header"><span>AST → Assembly</span><span>pseudo-asm</span></div>
                <pre>{`.DATA
  x    NUM  0

.TEXT
_start:
  STORE    [x], 10         ; declare number x
  LOAD     t1, [x]
  CGT      t2, t1, 5       ; > operation
  CMP      t2, 0           ; evaluate condition
  JEQ      ELSE_1          ; jump to else if false
  PRINT    "Big"
  JMP      END_IF_2
ELSE_1:
  PRINT    "Small"
END_IF_2:
  HALT                     ; end of program`}
                </pre>
              </div>
              <p>
                The <strong>Assembly</strong> tab shows this output. Registers like <code style={{color:'var(--token-ident)'}}>t1</code>, <code style={{color:'var(--token-ident)'}}>t2</code> are
                temporary values, and labels like <code style={{color:'var(--accent)'}}>ELSE_1</code> are jump targets.
              </p>
            </div>
          </div>
        </div>

        {/* Step 5: Execute */}
        <div className="doc-section">
          <div className="tutorial-step">
            <div className="tutorial-step-num">5</div>
            <div className="tutorial-step-content">
              <div className="tutorial-step-title">Execution (Interpreter)</div>
              <p>
                Finally, the <strong>interpreter</strong> walks the AST directly and
                evaluates it — computing values, managing variables in memory, and running
                control flow. It produces the final program output.
              </p>
              <p>
                MY-Lang uses a <em>tree-walking interpreter</em> rather than executing the
                assembly (which is displayed purely for illustration). Real compilers would
                compile the assembly to machine code and run it on the CPU.
              </p>
              <div className="code-block">
                <div className="code-block-header"><span>Program Output</span><span>console</span></div>
                <pre>{`▶ Program started
› Big
■ Program finished`}
                </pre>
              </div>
              <p>
                The <strong>Output</strong> tab shows the full console output including
                system messages, print statements, and any runtime errors.
              </p>
            </div>
          </div>
        </div>

        {/* Try it yourself */}
        <div className="doc-section">
          <h2 className="doc-section-title">Try It Yourself</h2>
          <p>
            Head back to the <strong>Editor</strong> and experiment with Step Mode to watch
            each phase process your code in real time. Try writing a program with a bug
            to see how the different analysis stages catch it!
          </p>
          <div style={{ marginTop: 16 }}>
            <a
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                background: 'rgba(0,212,255,0.1)',
                border: '1px solid rgba(0,212,255,0.35)',
                borderRadius: 8,
                color: 'var(--accent)',
                fontSize: 13,
                fontFamily: 'JetBrains Mono',
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,212,255,0.1)'}
            >
              ⌨ Open the IDE →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
