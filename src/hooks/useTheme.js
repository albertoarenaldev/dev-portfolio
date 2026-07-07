import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'portfolio-theme';
const DARK = 'dark';
const LIGHT = 'light';

/**
 * Persisted theme controller.
 * Reads saved value from localStorage; falls back to system preference.
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return DARK;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === LIGHT || stored === DARK) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? LIGHT : DARK;
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* storage unavailable */
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === DARK ? LIGHT : DARK));
  }, []);

  return [theme, toggleTheme];
}
