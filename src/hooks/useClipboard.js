import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Minimal clipboard helper with graceful fallback for non-secure contexts
 * (older browsers, embedded webviews, http:// origins).
 * Returns a `copied` flag that flips true for `timeoutMs` after a successful copy.
 */
export function useClipboard(timeoutMs = 1800) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  const copy = useCallback(
    async (text) => {
      try {
        if (
          typeof navigator !== 'undefined' &&
          navigator.clipboard &&
          typeof navigator.clipboard.writeText === 'function'
        ) {
          await navigator.clipboard.writeText(text);
        } else {
          // Legacy fallback.
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.setAttribute('readonly', '');
          ta.style.position = 'absolute';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        setCopied(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), timeoutMs);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Clipboard copy failed:', err);
      }
    },
    [timeoutMs]
  );

  return { copied, copy };
}
