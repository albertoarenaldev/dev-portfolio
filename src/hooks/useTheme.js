import { useCallback, useEffect, useState } from 'react';
import { THEME_STORAGE_KEY, THEME_DARK, THEME_LIGHT, DEFAULT_THEME } from '../themeConfig';

/**
 * Persisted theme controller. Brand default is DARK; explicit user
 * choice via the navbar toggle wins (stored in localStorage).
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_THEME;
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === THEME_LIGHT || stored === THEME_DARK) return stored;
    return DEFAULT_THEME;
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* storage unavailable */
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === THEME_DARK ? THEME_LIGHT : THEME_DARK));
  }, []);

  return [theme, toggleTheme];
}
