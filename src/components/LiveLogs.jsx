import { useEffect, useRef, useState } from 'react';
import { FiTerminal, FiChevronDown, FiChevronUp, FiTrash2, FiMinimize2 } from 'react-icons/fi';
import { useLiveLogs } from '../hooks/useLiveLogs';

const LEVEL_COLORS = {
  INFO: 'var(--accent-cyan)',
  WARN: 'var(--accent-pink)',
  ERROR: '#ef4444',
  DEBUG: 'var(--text-subtle)',
  SUCCESS: '#10b981',
};

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('es-ES', { hour12: false });
}

export default function LiveLogs() {
  const { logs, clearLogs } = useLiveLogs();
  const [minimized, setMinimized] = useState(false);
  const [collapsed, setCollapsed] = useState(true); // start collapsed
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [logs]);

  // Toggle panel
  const toggle = () => setCollapsed((v) => !v);

  if (minimized) {
    return (
      <button
        type="button"
        className="live-logs-badge"
        onClick={() => setMinimized(false)}
        title="Mostrar logs"
      >
        <FiTerminal size={14} />
        <span>{logs.length}</span>
      </button>
    );
  }

  return (
    <div className={`live-logs ${collapsed ? 'live-logs-collapsed' : ''}`}>
      <div className="live-logs-header">
        <button type="button" className="live-logs-header-btn" onClick={toggle} title={collapsed ? 'Expandir' : 'Colapsar'}>
          <FiTerminal size={14} />
          <span className="live-logs-title">Backend Logs</span>
          <span className="live-logs-count">{logs.length}</span>
          {collapsed ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
        </button>
        {!collapsed && (
          <div className="live-logs-actions">
            <button type="button" onClick={clearLogs} title="Limpiar logs">
              <FiTrash2 size={14} />
            </button>
            <button type="button" onClick={() => setMinimized(true)} title="Minimizar">
              <FiMinimize2 size={14} />
            </button>
          </div>
        )}
      </div>

      {!collapsed && (
        <div className="live-logs-list" ref={listRef}>
          {logs.length === 0 ? (
            <div className="live-logs-empty">
              <span className="live-logs-prompt">$</span> Esperando eventos...
            </div>
          ) : (
            logs.map((entry) => (
              <div key={entry.id} className="live-log-entry">
                <span className="live-log-ts mono">{formatTime(entry.ts)}</span>
                <span
                  className="live-log-level mono"
                  style={{ color: LEVEL_COLORS[entry.level] || 'var(--text-subtle)' }}
                >
                  [{entry.level}]
                </span>
                <span className="live-log-msg">{entry.message}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
