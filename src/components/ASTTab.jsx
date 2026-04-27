import { useState } from 'react';

function ASTNode({ node, depth = 0 }) {
  const [collapsed, setCollapsed] = useState(depth > 3);

  if (!node || typeof node !== 'object') return null;

  const type = node.type || 'unknown';

  // Get a short summary label for the node
  const getSummary = (n) => {
    if (!n) return '';
    switch (n.type) {
      case 'Literal': return `= ${JSON.stringify(n.value)}`;
      case 'Identifier': return `"${n.name}"`;
      case 'BinaryExpr': return `op: "${n.op}"`;
      case 'UnaryExpr': return `op: "${n.op}"`;
      case 'VarDecl': return `${n.varType} ${n.name}`;
      case 'ArrayDecl': return `${n.name}[${n.elements?.length || 0}]`;
      case 'Assign': return `${n.name} =`;
      case 'FuncCall': return `${n.name}(${n.args?.length || 0} args)`;
      case 'IndexExpr': return `${n.name}[...]`;
      case 'IndexAssign': return `${n.name}[...] =`;
      case 'Program': return `(${n.body?.length || 0} statements)`;
      case 'Block': return `(${n.body?.length || 0} stmts)`;
      case 'PrintStmt': return `(${n.args?.length || 0} args)`;
      default: return '';
    }
  };

  // Get child entries to render
  const getChildren = (n) => {
    const children = [];
    for (const [key, val] of Object.entries(n)) {
      if (key === 'type' || key === 'line') continue;
      if (val === null || val === undefined) continue;
      if (typeof val === 'object') {
        children.push({ key, val });
      }
    }
    return children;
  };

  const children = getChildren(node);
  const hasChildren = children.length > 0;
  const summary = getSummary(node);
  const cssClass = `ast-${type}`;

  return (
    <div className={`ast-node ${depth === 0 ? 'ast-node-root' : ''}`}>
      <div
        className="ast-label"
        onClick={() => hasChildren && setCollapsed(!collapsed)}
      >
        <span className="ast-toggle">
          {hasChildren ? (collapsed ? '▶' : '▼') : '·'}
        </span>
        <span className={`ast-node-type ${cssClass}`}>{type}</span>
        {summary && <span className="ast-value">{summary}</span>}
        {node.line && (
          <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 4 }}>
            :L{node.line}
          </span>
        )}
      </div>

      {!collapsed && hasChildren && (
        <div>
          {children.map(({ key, val }) => {
            if (Array.isArray(val)) {
              return (
                <div key={key} className="ast-node">
                  <div className="ast-label">
                    <span className="ast-toggle">·</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      {key} [{val.length}]
                    </span>
                  </div>
                  {val.map((item, idx) => (
                    item && typeof item === 'object' && item.type ? (
                      <ASTNode key={idx} node={item} depth={depth + 1} />
                    ) : (
                      <div key={idx} className="ast-node">
                        <div className="ast-label">
                          <span className="ast-toggle">·</span>
                          <span style={{ fontSize: 11, color: 'var(--token-string)' }}>
                            [{idx}]: {JSON.stringify(item)}
                          </span>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              );
            }
            if (val && typeof val === 'object' && val.type) {
              return (
                <div key={key} className="ast-node">
                  <div className="ast-label" style={{ paddingBottom: 0 }}>
                    <span className="ast-toggle" style={{ opacity: 0 }}>·</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontStyle: 'italic' }}>{key}:</span>
                  </div>
                  <ASTNode node={val} depth={depth + 1} />
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
}

export default function ASTTab({ ast = null, errors = [] }) {
  const [expandAll, setExpandAll] = useState(false);

  if (!ast) {
    return (
      <div className="empty-state">
        <div className="empty-icon">⬡</div>
        <div className="empty-text">Run code to see the AST tree</div>
      </div>
    );
  }

  return (
    <div>
      {errors.length > 0 && errors.map((e, i) => (
        <div key={i} className="error-banner">
          <span>⚠</span>
          <span>{e.message}</span>
        </div>
      ))}

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
          Abstract Syntax Tree — click nodes to expand/collapse
        </span>
      </div>

      <div className="ast-tree">
        <ASTNode node={ast} depth={0} key={expandAll} />
      </div>
    </div>
  );
}
