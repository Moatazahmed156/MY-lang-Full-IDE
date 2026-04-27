export default function AssemblyTab({ assembly = [] }) {
  if (assembly.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">⬡</div>
        <div className="empty-text">Run code to see generated assembly</div>
      </div>
    );
  }

  let lineNum = 0;

  const renderLine = (ins, i) => {
    if (ins.isEmpty) {
      return <div key={i} style={{ height: 8 }} />;
    }

    if (ins.isSection) {
      return (
        <div key={i} className="asm-line" style={{ marginTop: 8, marginBottom: 4 }}>
          <span className="asm-lnum"></span>
          <span className="asm-section">{ins.text}</span>
        </div>
      );
    }

    if (ins.isData) {
      lineNum++;
      return (
        <div key={i} className="asm-line">
          <span className="asm-lnum">{lineNum}</span>
          <span className="asm-label" style={{ minWidth: 120, display: 'inline-block' }}>{ins.name}</span>
          <span className="asm-op" style={{ minWidth: 50, display: 'inline-block' }}>{ins.type}</span>
          <span className="asm-args">{ins.value}</span>
        </div>
      );
    }

    if (ins.isLabel) {
      return (
        <div key={i} className="asm-line" style={{ marginTop: 6 }}>
          <span className="asm-lnum"></span>
          <span className="asm-label">{ins.op}</span>
          {ins.comment && <span className="asm-comment" style={{ marginLeft: 16 }}>; {ins.comment}</span>}
        </div>
      );
    }

    // Comment-only line
    if (ins.op && ins.op.startsWith(';')) {
      return (
        <div key={i} className="asm-line">
          <span className="asm-lnum"></span>
          <span className="asm-comment">{ins.op}</span>
        </div>
      );
    }

    // Empty line
    if (!ins.op) {
      return <div key={i} style={{ height: 6 }} />;
    }

    lineNum++;
    return (
      <div key={i} className="asm-line">
        <span className="asm-lnum">{lineNum}</span>
        <span className="asm-op" style={{ minWidth: 70, display: 'inline-block' }}>{ins.op}</span>
        {ins.args && <span className="asm-args" style={{ minWidth: 200, display: 'inline-block' }}>{ins.args}</span>}
        {ins.comment && <span className="asm-comment">; {ins.comment}</span>}
      </div>
    );
  };

  const instrCount = assembly.filter(a => !a.isEmpty && !a.isSection && !a.isLabel && a.op && !a.op.startsWith(';')).length;

  return (
    <div>
      <div className="assembly-viewer">
        <div className="assembly-header">
          <span>MY-Lang Pseudo-Assembly</span>
          <span>{instrCount} instructions</span>
        </div>
        <div className="assembly-code">
          {assembly.map((ins, i) => renderLine(ins, i))}
        </div>
      </div>
    </div>
  );
}
