import './terminal.css';
import { useAppSelector } from '../../state/hooks';
import { selectTerminalOutput } from '../../state/selectors';
import { useEffect, useRef } from 'react';

function Terminal() {
  const terminalOutput = useAppSelector(selectTerminalOutput);
  const terminalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    terminalRef.current!.scrollTop = terminalRef.current!.scrollHeight;
  }, [terminalOutput.length]);

  return (
    <div ref={terminalRef} className="terminal">
      <pre>{terminalOutput.join('\n')}</pre>
    </div>
  );
}

export default Terminal;
