import { useState } from 'react';
import { EXAMPLES } from '../compiler/examples.js';

const STAGES = ['lexer', 'parser', 'semantic', 'codegen', 'execute'];

export default function Toolbar({ onRun, onReset, onLoadExample, stepMode, stepStage, onToggleStep, onNextStep }) {
  const [showExamples, setShowExamples] = useState(false);

  const stageIndex = STAGES.indexOf(stepStage);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="editor-toolbar" style={{ justifyContent: 'space-between', borderTop: 'none' }}>
        <div className="toolbar-left" style={{ gap: 6 }}>
          <button className="btn btn-run" onClick={onRun}>
            <span className="btn-icon">▶</span> Run
          </button>

          <button
            className="btn btn-step"
            onClick={onToggleStep}
            style={stepMode ? { background: 'rgba(124,58,237,0.25)', borderColor: 'rgba(124,58,237,0.6)' } : {}}
          >
            <span className="btn-icon">⏭</span> {stepMode ? 'Step ON' : 'Step'}
          </button>

          {stepMode && (
            <button className="btn btn-step" onClick={onNextStep} style={{ borderColor: 'rgba(0,212,255,0.4)', color: 'var(--accent)' }}>
              <span className="btn-icon">→</span> Next
            </button>
          )}

          <div style={{ position: 'relative' }}>
            <button className="btn btn-example" onClick={() => setShowExamples(!showExamples)}>
              <span className="btn-icon">⊞</span> Examples
            </button>
            {showExamples && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                zIndex: 200,
                marginTop: 4,
                background: 'var(--bg-panel)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                minWidth: 180,
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                overflow: 'hidden',
              }}>
                {EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      onLoadExample(ex.code);
                      setShowExamples(false);
                    }}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 14px',
                      background: 'transparent',
                      color: 'var(--text-secondary)',
                      fontSize: 12,
                      borderBottom: i < EXAMPLES.length - 1 ? '1px solid var(--border)' : 'none',
                      borderRadius: 0,
                    }}
                    onMouseEnter={e => e.target.style.background = 'var(--bg-hover)'}
                    onMouseLeave={e => e.target.style.background = 'transparent'}
                  >
                    {ex.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button className="btn btn-reset" onClick={onReset}>
          <span className="btn-icon">↺</span> Reset
        </button>
      </div>

      {stepMode && (
        <div className="step-panel">
          <span className="step-label">STEP MODE</span>
          <div className="step-stages">
            {STAGES.map((s, i) => (
              <span
                key={s}
                className={`step-stage${i < stageIndex ? ' done' : ''}${i === stageIndex ? ' active' : ''}`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
