export default function SemanticTab({ symbolTable = [], errors = [], warnings = [] }) {
  const hasData = symbolTable.length > 0 || errors.length > 0;

  if (!hasData && errors.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">⬡</div>
        <div className="empty-text">Run code to see semantic analysis</div>
      </div>
    );
  }

  return (
    <div>
      {/* Symbol Table */}
      <div className="semantic-section">
        <div className="semantic-section-title">Symbol Table</div>
        {symbolTable.length === 0 ? (
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>No symbols declared</div>
        ) : (
          <table className="symbol-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Type</th>
                <th>Line</th>
                <th>Initialized</th>
              </tr>
            </thead>
            <tbody>
              {symbolTable.map((sym, i) => (
                <tr key={i}>
                  <td style={{ color: 'var(--text-muted)', fontSize: 11 }}>{i + 1}</td>
                  <td style={{ color: 'var(--token-ident)', fontWeight: 500 }}>{sym.name}</td>
                  <td><span className="sym-type">{sym.varType}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{sym.line}</td>
                  <td style={{ color: sym.value ? 'var(--success)' : 'var(--text-muted)' }}>
                    {sym.value ? '✓ yes' : '— no'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Errors */}
      <div className="semantic-section">
        <div className="semantic-section-title">Semantic Errors</div>
        {errors.length === 0 ? (
          <div className="sem-ok">
            <span>✓</span>
            <span>No semantic errors found</span>
          </div>
        ) : (
          <div className="sem-errors">
            {errors.map((e, i) => (
              <div key={i} className="sem-error">
                <span className="sem-error-icon">✖</span>
                <div>
                  <div className="sem-error-msg">{e.message}</div>
                  {e.line && <div className="sem-error-line">Line {e.line}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="semantic-section">
          <div className="semantic-section-title">Warnings</div>
          <div className="sem-errors">
            {warnings.map((w, i) => (
              <div key={i} className="sem-error" style={{ borderColor: 'rgba(255,170,0,0.25)', background: 'rgba(255,170,0,0.06)' }}>
                <span style={{ color: 'var(--warning)' }}>⚠</span>
                <div>
                  <div style={{ color: 'var(--text-secondary)' }}>{w.message}</div>
                  {w.line && <div style={{ color: 'var(--warning)', fontSize: 11 }}>Line {w.line}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
