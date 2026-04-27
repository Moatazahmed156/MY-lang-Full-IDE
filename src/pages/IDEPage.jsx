import { useState, useCallback, useRef } from 'react';
import CodeEditor from '../components/CodeEditor.jsx';
import RightPanel from '../components/RightPanel.jsx';
import Toolbar from '../components/Toolbar.jsx';
import { runPipeline, runStage } from '../compiler/index.js';
import { DEFAULT_CODE } from '../compiler/examples.js';

const STAGES = ['lexer', 'parser', 'semantic', 'codegen', 'execute'];

export default function IDEPage() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [result, setResult] = useState(null);
  const [stepMode, setStepMode] = useState(false);
  const [stepIndex, setStepIndex] = useState(-1);

  const allErrors = [
    ...(result?.lexerErrors || []),
    ...(result?.parserErrors || []),
    ...(result?.semanticErrors || []),
  ];

  const handleRun = useCallback(() => {
    if (stepMode) {
      // Start step mode from beginning
      setStepIndex(0);
      const r = runStage(code, STAGES[0]);
      setResult(r);
    } else {
      const r = runPipeline(code);
      setResult(r);
    }
  }, [code, stepMode]);

  const handleNextStep = useCallback(() => {
    const nextIdx = stepIndex + 1;
    if (nextIdx >= STAGES.length) return;
    setStepIndex(nextIdx);
    const r = runStage(code, STAGES[nextIdx]);
    setResult(r);
  }, [code, stepIndex]);

  const handleReset = useCallback(() => {
    setCode(DEFAULT_CODE);
    setResult(null);
    setStepIndex(-1);
  }, []);

  const handleLoadExample = useCallback((exampleCode) => {
    setCode(exampleCode);
    setResult(null);
    setStepIndex(-1);
  }, []);

  const handleToggleStep = useCallback(() => {
    setStepMode(prev => !prev);
    setStepIndex(-1);
    setResult(null);
  }, []);

  const stepStage = stepIndex >= 0 ? STAGES[stepIndex] : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 48px)', overflow: 'hidden' }}>
      <Toolbar
        onRun={handleRun}
        onReset={handleReset}
        onLoadExample={handleLoadExample}
        stepMode={stepMode}
        stepStage={stepStage}
        onToggleStep={handleToggleStep}
        onNextStep={handleNextStep}
      />
      <div className="ide-layout">
        <CodeEditor
          value={code}
          onChange={setCode}
          errors={allErrors}
        />
        <div className="resizer" />
        <RightPanel result={result} stepStage={stepStage} />
      </div>
    </div>
  );
}
