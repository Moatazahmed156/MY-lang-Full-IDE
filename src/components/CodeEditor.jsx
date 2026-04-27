import { useRef, useState, useEffect, useCallback } from 'react';

export default function CodeEditor({ value, onChange, errors = [] }) {
  const textareaRef = useRef(null);
  const lineNumRef = useRef(null);
  const [cursorLine, setCursorLine] = useState(1);
  const [cursorCol, setCursorCol] = useState(1);

  const lines = value.split('\n');
  const lineCount = lines.length;

  // Sync scroll between textarea and line numbers
  const handleScroll = useCallback(() => {
    if (lineNumRef.current && textareaRef.current) {
      lineNumRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = textareaRef.current;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newVal = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newVal);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      });
    }
  }, [value, onChange]);

  const handleChange = useCallback((e) => {
    onChange(e.target.value);
  }, [onChange]);

  const handleCursorMove = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    const pos = ta.selectionStart;
    const textBefore = value.substring(0, pos);
    const ln = textBefore.split('\n').length;
    const col = textBefore.split('\n').pop().length + 1;
    setCursorLine(ln);
    setCursorCol(col);
  }, [value]);

  // Error lines set
  const errorLines = new Set(errors.map(e => e.line));

  const totalErrors = errors.length;

  return (
    <div className="editor-panel">
      <div className="editor-toolbar">
        <div className="toolbar-left">
          <div className="toolbar-file">
            <span className="file-icon">◈</span>
            <span className="file-name">main.my</span>
          </div>
        </div>
      </div>

      <div className="code-editor-wrapper">
        <div className="line-numbers" ref={lineNumRef}>
          {Array.from({ length: lineCount }, (_, i) => {
            const ln = i + 1;
            return (
              <div
                key={ln}
                className={`line-number${ln === cursorLine ? ' active' : ''}${errorLines.has(ln) ? ' error' : ''}`}
                style={errorLines.has(ln) ? { color: 'var(--error)' } : {}}
              >
                {ln}
              </div>
            );
          })}
        </div>
        <textarea
          ref={textareaRef}
          className="code-textarea"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          onClick={handleCursorMove}
          onKeyUp={handleCursorMove}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          placeholder={`// Write your MY-Lang code here\nmain {\n  print("Hello, World!")\n}`}
        />
      </div>

      <div className="editor-statusbar">
        <div className="statusbar-items">
          <div className="statusbar-item statusbar-lang">MY-Lang</div>
          <div className="statusbar-item">Ln {cursorLine}, Col {cursorCol}</div>
          <div className="statusbar-item">{lineCount} lines</div>
        </div>
        <div className="statusbar-items">
          {totalErrors > 0 ? (
            <div className="statusbar-item statusbar-errors">⚠ {totalErrors} error{totalErrors > 1 ? 's' : ''}</div>
          ) : (
            <div className="statusbar-item statusbar-ok">✓ No errors</div>
          )}
        </div>
      </div>
    </div>
  );
}
