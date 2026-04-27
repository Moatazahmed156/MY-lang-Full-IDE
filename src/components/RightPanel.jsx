import { useState } from 'react';
import TokensTab from './TokensTab.jsx';
import ParserTab from './ParserTab.jsx';
import ASTTab from './ASTTab.jsx';
import SemanticTab from './SemanticTab.jsx';
import AssemblyTab from './AssemblyTab.jsx';
import OutputTab from './OutputTab.jsx';

const TABS = [
  { id: 'tokens',   label: 'Tokens',   icon: '⬡' },
  { id: 'parser',   label: 'Parser',   icon: '⎇' },
  { id: 'ast',      label: 'AST',      icon: '⊞' },
  { id: 'semantic', label: 'Semantic', icon: '⚙' },
  { id: 'assembly', label: 'Assembly', icon: '⊟' },
  { id: 'output',   label: 'Output',   icon: '▶' },
];

export default function RightPanel({ result, stepStage }) {
  const [activeTab, setActiveTab] = useState('output');

  const {
    tokens = [],
    lexerErrors = [],
    ast = null,
    parserErrors = [],
    symbolTable = [],
    semanticErrors = [],
    semanticWarnings = [],
    assembly = [],
    output = [],
    executionError = null,
  } = result || {};

  const getBadge = (id) => {
    switch (id) {
      case 'tokens': return tokens.filter(t => t.type !== 'EOF').length || null;
      case 'semantic': return semanticErrors.length > 0 ? semanticErrors.length : null;
      case 'output': return output.filter(o => o.type === 'out').length || null;
      default: return null;
    }
  };

  const isError = (id) => {
    if (id === 'semantic') return semanticErrors.length > 0;
    return false;
  };

  return (
    <div className="right-panel">
      <div className="tab-bar">
        {TABS.map(tab => {
          const badge = getBadge(tab.id);
          const err = isError(tab.id);
          return (
            <button
              key={tab.id}
              className={`tab-btn${activeTab === tab.id ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
              {badge !== null && (
                <span className={`tab-badge${err ? ' error' : ''}`}>{badge}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="tab-content">
        {activeTab === 'tokens'   && <TokensTab tokens={tokens} errors={lexerErrors} />}
        {activeTab === 'parser'   && <ParserTab ast={ast} errors={parserErrors} />}
        {activeTab === 'ast'      && <ASTTab ast={ast} errors={parserErrors} />}
        {activeTab === 'semantic' && <SemanticTab symbolTable={symbolTable} errors={semanticErrors} warnings={semanticWarnings} />}
        {activeTab === 'assembly' && <AssemblyTab assembly={assembly} />}
        {activeTab === 'output'   && <OutputTab output={output} error={executionError} />}
      </div>
    </div>
  );
}
