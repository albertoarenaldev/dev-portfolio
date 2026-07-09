import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const LiveLogsContext = createContext(null);

const MAX_LOGS = 80;

export function LiveLogsProvider({ children }) {
  const [logs, setLogs] = useState([]);
  const idRef = useRef(0);

  const addLog = useCallback(({ level = 'INFO', message }) => {
    const entry = { id: ++idRef.current, level, message, ts: Date.now() };
    setLogs((prev) => {
      const next = [...prev, entry];
      return next.length > MAX_LOGS ? next.slice(next.length - MAX_LOGS) : next;
    });
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  const value = useMemo(() => ({ logs, addLog, clearLogs }), [logs, addLog, clearLogs]);

  return (
    <LiveLogsContext.Provider value={value}>
      {children}
    </LiveLogsContext.Provider>
  );
}

export function useLiveLogs() {
  const ctx = useContext(LiveLogsContext);
  if (!ctx) throw new Error('useLiveLogs must be used within LiveLogsProvider');
  return ctx;
}
