export default function DocsPage() {
  return (
    <div className="page-layout">
      <div className="page-content">
        <div className="page-hero">
          <div className="page-hero-badge">📄 Documentation</div>
          <h1 className="page-title"><span>MY-Lang</span> Reference</h1>
          <p className="page-subtitle">
            Complete language reference for MY-Lang — a simple, educational programming language
            designed for learning compiler construction.
          </p>
        </div>

        {/* Data Types */}
        <div className="doc-section">
          <h2 className="doc-section-title">Data Types</h2>
          <p>MY-Lang supports four primitive types and one collection type:</p>
          <div className="type-grid">
            <div className="type-card">
              <div className="type-card-name">number</div>
              <div className="type-card-desc">Integer or floating-point numeric value</div>
              <div className="type-card-example">number x = 42</div>
            </div>
            <div className="type-card">
              <div className="type-card-name">text</div>
              <div className="type-card-desc">String of characters</div>
              <div className="type-card-example">text s = "hello"</div>
            </div>
            <div className="type-card">
              <div className="type-card-name">boolean</div>
              <div className="type-card-desc">true or false value</div>
              <div className="type-card-example">boolean b = true</div>
            </div>
            <div className="type-card">
              <div className="type-card-name">Aray</div>
              <div className="type-card-desc">Ordered list of values</div>
              <div className="type-card-example">Aray a = [1, 2, 3]</div>
            </div>
          </div>
        </div>

        {/* Variables */}
        <div className="doc-section">
          <h2 className="doc-section-title">Variables</h2>
          <p>Variables must be declared with a type before use. Assignment uses <code style={{color:'var(--accent)'}}>= </code> operator.</p>
          <div className="code-block">
            <div className="code-block-header"><span>Variable Declaration</span><span>my-lang</span></div>
            <pre><p><span class="kw">number</span> <span class="id">x</span> <span class="op">=</span> <span class="num">10</span></p>
<p><span class="kw">text</span> <span class="id">name</span> <span class="op">=</span> <span class="str">"Alice"</span></p>
<p><span class="kw">boolean</span> <span class="id">active</span> <span class="op">=</span> <span class="kw">true</span></p>
<p><span class="kw">Aray</span> <span class="id">scores</span> <span class="op">=</span> [<span class="num">95</span>, <span class="num">87</span>, <span class="num">91</span>]</p>
<p><span class="cm">// Re-assignment </span></p>
<p><span class="id">x</span> <span class="op">=</span> <span class="num">20</span></p>
<p><span class="id">name</span> <span class="op">=</span> <span class="str">"Bob"</span></p>
            </pre>
          </div>
        </div>

        {/* Operators */}
        <div className="doc-section">
          <h2 className="doc-section-title">Operators</h2>
          <p>MY-Lang supports arithmetic, comparison, and logical operators:</p>
          <div className="code-block">
            <div className="code-block-header"><span>Operators</span><span>my-lang</span></div>
            <pre>
              <span class="cm">// Arithmetic</span>
<p><span class="id">x</span> <span class="op">+</span> <span class="id">y</span>    <span class="cm">// addition</span></p>

<p><span class="id">x</span> <span class="op">-</span> <span class="id">y</span>    <span class="cm">// subtraction</span></p>
<p><span class="id">x</span> <span class="op">*</span> <span class="id">y</span>    <span class="cm">// multiplication</span></p>
<p><span class="id">x</span> <span class="op">/</span> <span class="id">y</span>    <span class="cm">// division</span></p>
<p><span class="id">x</span> <span class="op">%</span> <span class="id">y</span>    <span class="cm">// modulo</span></p>

<span class="cm">// Comparison</span>
<p><span class="id">x</span> <span class="op">&gt;</span> <span class="id">y</span>    <span class="id">x</span> <span class="op">&lt;</span> <span class="id">y</span>    <span class="id">x</span> <span class="op">&gt;=</span> <span class="id">y</span>    <span class="id">x</span> <span class="op">&lt;=</span> <span class="id">y</span></p>
<p><span class="id">x</span> <span class="op">==</span> <span class="id">y</span>   <span class="id">x</span> <span class="op">!=</span> <span class="id">y</span></p>

<span class="cm">// Logical</span>
<pp><span class="id">a</span> <span class="op">and</span> <span class="id">b</span>   <span class="cm">// also: &&</span></pp>
<p><span class="id">a</span> <span class="op">or</span> <span class="id">b</span>    <span class="cm">// also: ||</span></p>
<p><span class="op">not</span> <span class="id">a</span>     <span class="cm">// also: !</span></p>
            </pre>
          </div>
        </div>

        {/* Control Flow */}
        <div className="doc-section">
          <h2 className="doc-section-title">Control Flow</h2>
          <p>MY-Lang supports if/else conditionals and while loops:</p>
          <div className="code-block">
            <div className="code-block-header"><span>if / else</span><span>my-lang</span></div>
         <pre>
  <span className="kw">if</span> (<span className="id">x</span> <span className="op">&gt;</span> <span className="num">10</span>) {'{'}
  {"\n  "}
  <span className="fn">print</span>(<span className="str">"big"</span>)
  {"\n"}{'} '}
  <span className="kw">else if</span> (<span className="id">x</span> <span className="op">==</span> <span className="num">10</span>) {'{'}
  {"\n  "}
  <span className="fn">print</span>(<span className="str">"exactly ten"</span>)
  {"\n"}{'} '}
  <span className="kw">else</span> {'{'}
  {"\n  "}
  <span className="fn">print</span>(<span className="str">"small"</span>)
  {"\n"}{'}'}
</pre>
          </div>
          <div className="code-block">
            <div className="code-block-header"><span>while loop</span><span>my-lang</span></div>
            <pre>
  <span className="kw">number</span> <span className="id">i</span> <span className="op">=</span> <span className="num">0</span>
  {"\n"}
  <span className="kw">while</span> (<span className="id">i</span> <span className="op">&lt;</span> <span className="num">5</span>) {"{"}
  {"\n  "}
  <span className="fn">print</span>(<span className="id">i</span>)
  {"\n  "}
  <span className="id">i</span> <span className="op">=</span> <span className="id">i</span> <span className="op">+</span> <span className="num">1</span>
  {"\n}"}
</pre>
          </div>
        </div>

        {/* Arrays */}
        <div className="doc-section">
          <h2 className="doc-section-title">Arrays (List)</h2>
          <p>Arrays are zero-indexed ordered collections. Access and modify with bracket notation.</p>
          <div className="code-block">
            <div className="code-block-header"><span>Array Usage</span><span>my-lang</span></div>
            <pre>
  <span className="kw">Array</span> <span className="id">fruits</span> <span className="op">=</span> [<span className="str">"apple"</span>, <span className="str">"banana"</span>, <span className="str">"cherry"</span>]
  {"\n\n"}
  <span className="cm">// Access element</span>
  {"\n"}
  <span className="fn">print</span>(<span className="id">fruits</span>[<span className="num">0</span>])    <span className="cm">// "apple"</span>
  {"\n\n"}
  <span className="cm">// Modify element</span>
  {"\n"}
  <span className="id">fruits</span>[<span className="num">1</span>] <span className="op">=</span> <span className="str">"blueberry"</span>
  {"\n\n"}
  <span className="cm">// Iterate</span>
  {"\n"}
  <span className="kw">number</span> <span className="id">i</span> <span className="op">=</span> <span className="num">0</span>
  {"\n"}
  <span className="kw">while</span> (<span className="id">i</span> <span className="op">&lt;</span> <span className="num">3</span>) {"{"}
  {"\n  "}
  <span className="fn">print</span>(<span className="id">fruits</span>[<span className="id">i</span>])
  {"\n  "}
  <span className="id">i</span> <span className="op">=</span> <span className="id">i</span> <span className="op">+</span> <span className="num">1</span>
  {"\n}"}
</pre>
          </div>
        </div>

        {/* Built-in Functions */}
        <div className="doc-section">
          <h2 className="doc-section-title">Built-in Functions</h2>
          <p>MY-Lang provides the following built-in functions:</p>
          <table className="symbol-table" style={{ marginTop: 10 }}>
            <thead>
              <tr><th>Function</th><th>Description</th><th>Example</th></tr>
            </thead>
            <tbody>
              {[
                ['print(...args)', 'Print values to console', 'print("hello", x)'],
                ['len(arr)', 'Length of array or string', 'len([1,2,3]) → 3'],
                ['str(val)', 'Convert to text', 'str(42) → "42"'],
                ['num(val)', 'Convert to number', 'num("5") → 5'],
                ['sqrt(x)', 'Square root', 'sqrt(16) → 4'],
                ['abs(x)', 'Absolute value', 'abs(-5) → 5'],
                ['floor(x)', 'Round down', 'floor(3.7) → 3'],
                ['ceil(x)', 'Round up', 'ceil(3.2) → 4'],
                ['round(x)', 'Round to nearest', 'round(3.5) → 4'],
                ['max(a,b,...)', 'Maximum value', 'max(1,5,3) → 5'],
                ['min(a,b,...)', 'Minimum value', 'min(1,5,3) → 1'],
                ['pow(x,y)', 'x raised to y', 'pow(2,8) → 256'],
                ['random()', 'Random 0..1', 'random()'],
              ].map(([fn, desc, ex]) => (
                <tr key={fn}>
                  <td style={{ color: 'var(--token-operator)', fontFamily: 'JetBrains Mono' }}>{fn}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{desc}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 11 }}>{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Program Structure */}
        <div className="doc-section">
          <h2 className="doc-section-title">Program Structure</h2>
          <p>Programs can optionally be wrapped in a <code style={{color:'var(--token-keyword)'}}>main</code> block. Both forms are valid:</p>
          <div className="code-block">
            <div className="code-block-header"><span>With main block</span><span>my-lang</span></div>
            <pre>
  <span className="kw">main</span> {"{"}
  {"\n  "}
  <span className="kw">number</span> <span className="id">x</span> <span className="op">=</span> <span className="num">5</span>
  {"\n  "}
  <span className="fn">print</span>(<span className="id">x</span>)
  {"\n}"}
</pre>
          </div>
          <div className="code-block">
            <div className="code-block-header"><span>Without main block</span><span>my-lang</span></div>
            <pre>
  <span className="kw">number</span> <span className="id">x</span> <span className="op">=</span> <span className="num">5</span>
  {"\n"}
  <span className="fn">print</span>(<span className="id">x</span>)
</pre>
          </div>
        </div>

        {/* Comments */}
        <div className="doc-section">
          <h2 className="doc-section-title">Comments</h2>
          <div className="code-block">
            <div className="code-block-header"><span>Comments</span><span>my-lang</span></div>
            <pre>
  <span className="cm">// Single-line comment</span>
  {"\n\n"}
  <span className="cm">/* Multi-line{"\n   "}comment */</span>
</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
