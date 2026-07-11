/** Single source of truth for theme constants.
 *  Shared by useTheme hook (React) and the Vite-generated
 *  pre-mount script in index.html to eliminate dark↔light flash.
 *
 *  Logic mirrors the inline script — keep both in sync.
 */
export const THEME_STORAGE_KEY = 'portfolio-theme';
export const THEME_DARK = 'dark';
export const THEME_LIGHT = 'light';
export const DEFAULT_THEME = THEME_DARK;
