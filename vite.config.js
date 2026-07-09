import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'

/** Injects a synchronous pre-mount <script> into index.html that reads
 *  localStorage('portfolio-theme') and applies documentElement.dataset.theme
 *  BEFORE React mounts — eliminates dark↔light flash on reload.
 *
 *  Reads src/themeConfig.js at build time to keep the storage key and
 *  default value in sync with the React hook (single source of truth). */
function themeBootstrapPlugin() {
  const PLACEHOLDER = '<!--theme-bootstrap-->'
  let cache = null

  function readConfig() {
    if (cache) return cache
    const src = readFileSync('src/themeConfig.js', 'utf-8')
    const key = src.match(/THEME_STORAGE_KEY\s*=\s*'([^']+)'/)?.[1] ?? 'portfolio-theme'
    const dark = src.match(/THEME_DARK\s*=\s*'([^']+)'/)?.[1] ?? 'dark'
    const light = src.match(/THEME_LIGHT\s*=\s*'([^']+)'/)?.[1] ?? 'light'
    const fallback = src.match(/DEFAULT_THEME\s*=\s*THEME_(DARK|LIGHT)/)?.[1]?.toLowerCase() ?? 'dark'
    cache = { key, dark, light, fallback }
    return cache
  }

  return {
    name: 'theme-bootstrap',
    enforce: 'post',
    transformIndexHtml(html) {
      if (!html.includes(PLACEHOLDER)) return html
      const { key, dark, light, fallback } = readConfig()
      const script = `<script>!function(){try{var t=window.localStorage.getItem('${key}');document.documentElement.dataset.theme=t==='${dark}'||t==='${light}'?t:'${fallback}'}catch(e){document.documentElement.dataset.theme='${fallback}'}}()</script>`
      return html.replace(PLACEHOLDER, script)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), themeBootstrapPlugin()],
  // Base path para GitHub Pages project site (https://albertoarenaldev.github.io/dev-portfolio/)
  base: '/dev-portfolio/',
})
