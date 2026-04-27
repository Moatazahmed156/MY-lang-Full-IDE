import { TokenType } from '../compiler/lexer.js';

export default function TokensTab({ tokens = [], errors = [] }) {
  const displayTokens = tokens.filter(t => t.type !== TokenType.EOF);

  if (displayTokens.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">⬡</div>
        <div className="empty-text">Run code to see tokens</div>
      </div>
    );
  }

  return (
    <div>
      {errors.length > 0 && errors.map((e, i) => (
        <div key={i} className="error-banner">
          <span>⚠</span>
          <span>{e.message} {e.line ? `(line ${e.line})` : ''}</span>
        </div>
      ))}

      <div style={{ marginBottom: 10, fontSize: 11, color: 'var(--text-muted)' }}>
        {displayTokens.length} tokens found
      </div>

      <table className="tokens-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Type</th>
            <th>Value</th>
            <th>Line</th>
          </tr>
        </thead>
        <tbody>
          {displayTokens.map((token, i) => (
            <tr key={i}>
              <td style={{ color: 'var(--text-muted)', fontSize: 11 }}>{i + 1}</td>
              <td>
                <span className={`token-type token-${token.type}`}>
                  {token.type}
                </span>
              </td>
              <td className="token-value">
                {token.type === TokenType.STRING ? `"${token.value}"` : token.value || <em style={{ color: 'var(--text-muted)' }}>ε</em>}
              </td>
              <td className="token-line">{token.line}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
