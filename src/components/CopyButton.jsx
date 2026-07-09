import { FiCopy, FiCheck } from 'react-icons/fi';
import { useClipboard } from '../hooks/useClipboard';
import { useLiveLogs } from '../hooks/useLiveLogs';

/**
 * Inline button that copies `value` to the clipboard with a brief "Copiado" feedback.
 */
export default function CopyButton({ value, label = 'Copiar' }) {
  const { copied, copy } = useClipboard();
  const { addLog } = useLiveLogs();

  const handleCopy = () => {
    copy(value);
    addLog({ level: 'INFO', message: `Action: CopyContactData → "${value.slice(0, 30)}${value.length > 30 ? '...' : ''}" [OK]` });
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`copy-btn ${copied ? 'is-copied' : ''}`}
      aria-label={`Copiar ${value}`}
    >
      {copied ? <FiCheck size={14} aria-hidden="true" /> : <FiCopy size={14} aria-hidden="true" />}
      <span role="status">{copied ? 'Copiado' : label}</span>
    </button>
  );
}
