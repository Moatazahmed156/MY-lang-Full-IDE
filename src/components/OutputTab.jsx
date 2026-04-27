import { useEffect, useRef } from 'react';

export default function OutputTab({ output = [], error = null }) {
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [output]);

  if (output.length === 0 && !error) {
    return (
      <div className="output-console" style={{ background: '#050508' }}>
        <div className="console-header">
          <div className="console-dots">
            <div className="console-dot dot-red" />
            <div className="console-dot dot-yellow" />
            <div className="console-dot dot-green" />
          </div>
          <div className="console-title">MY-Lang Console</div>
          <div />
        </div>
        <div className="console-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>▶ Press Run to execute your program</span>
        </div>
      </div>
    );
  }

  return (
    <div className="output-console">
      <div className="console-header">
        <div className="console-dots">
          <div className="console-dot dot-red" />
          <div className="console-dot dot-yellow" />
          <div className="console-dot dot-green" />
        </div>
        <div className="console-title">MY-Lang Console — {output.filter(o => o.type === 'out').length} line(s) output</div>
        <div />
      </div>
      <div className="console-body" ref={bodyRef}>
        {output.map((line, i) => {
          if (line.type === 'sys') {
            return (
              <div key={i} className="console-line">
                <span className="console-sys">{line.value}</span>
              </div>
            );
          }
          if (line.type === 'err') {
            return (
              <div key={i} className="console-line">
                <span className="console-prompt" style={{ color: 'var(--error)' }}>✖</span>
                <span className="console-err">{line.value}</span>
              </div>
            );
          }
          if (line.type === 'info') {
            return (
              <div key={i} className="console-line">
                <span className="console-prompt" style={{ color: 'var(--accent)' }}>ℹ</span>
                <span className="console-info">{line.value}</span>
              </div>
            );
          }
          return (
            <div key={i} className="console-line">
              <span className="console-prompt">›</span>
              <span className="console-out">{line.value}</span>
            </div>
          );
        })}
        {error && (
          <div className="console-line" style={{ marginTop: 8 }}>
            <span className="console-err">RuntimeError: {error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
