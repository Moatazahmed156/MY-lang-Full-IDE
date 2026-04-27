import { useState } from 'react';

export default function ParserTab({ ast = null, errors = [] }) {
  const [indent, setIndent] = useState(2);

  if (!ast) {
    return (
      <div className="empty-state">
        <div className="empty-icon">⬡</div>
        <div className="empty-text">Run code to see parsed AST (JSON)</div>
      </div>
    );
  }

  const json = JSON.stringify(ast, null, indent);

  // Simple syntax highlighting for JSON
  const highlighted = json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          return `<span style="color:var(--token-ident)">${match}</span>`;
        }
        return `<span style="color:var(--token-string)">${match}</span>`;
      }
      if (/true|false/.test(match)) return `<span style="color:var(--token-number)">${match}</span>`;
      if (/null/.test(match)) return `<span style="color:var(--text-muted)">${match}</span>`;
      return `<span style="color:var(--token-number)">${match}</span>`;
    }
  );

  return (
    <div>
      {errors.length > 0 && errors.map((e, i) => (
        <div key={i} className="error-banner">
          <span>⚠</span>
          <span>{e.message} {e.line ? `(line ${e.line})` : ''}</span>
        </div>
      ))}

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Indent:</span>
        {[2, 4].map(n => (
          <button
            key={n}
            onClick={() => setIndent(n)}
            style={{
              padding: '2px 10px',
              borderRadius: 4,
              fontSize: 11,
              background: indent === n ? 'rgba(0,212,255,0.12)' : 'transparent',
              border: `1px solid ${indent === n ? 'rgba(0,212,255,0.35)' : 'var(--border)'}`,
              color: indent === n ? 'var(--accent)' : 'var(--text-muted)',
            }}
          >
            {n}
          </button>
        ))}
        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 'auto' }}>
          {JSON.stringify(ast).length} chars
        </span>
      </div>

      <div className="json-viewer">
        <pre dangerouslySetInnerHTML={{ __html: highlighted }} />
      </div>
    </div>
  );
}
