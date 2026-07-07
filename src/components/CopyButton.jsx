import { FiCopy, FiCheck } from 'react-icons/fi';
import { useClipboard } from '../hooks/useClipboard';

/**
 * Inline button that copies `value` to the clipboard with a brief "Copiado" feedback.
 */
export default function CopyButton({ value, label = 'Copiar' }) {
  const { copied, copy } = useClipboard();

  return (
    <button
      type="button"
      onClick={() => copy(value)}
      className={`copy-btn ${copied ? 'is-copied' : ''}`}
      aria-label={`Copiar ${value}`}
    >
      {copied ? <FiCheck size={14} aria-hidden="true" /> : <FiCopy size={14} aria-hidden="true" />}
      <span role="status">{copied ? 'Copiado' : label}</span>
    </button>
  );
}
