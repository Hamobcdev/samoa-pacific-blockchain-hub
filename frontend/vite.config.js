import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // ── REQUIRED FOR GITHUB PAGES ──────────────────────────────────────────────
  // Without this, all asset paths will be absolute (e.g. /assets/index.js)
  // which breaks on GitHub Pages because the site lives at:
  //   https://hamobcdev.github.io/samoa-pacific-blockchain-hub/
  // not at the root /
  // Set base to your repo name (with leading and trailing slashes):
  base: '/samoa-pacific-blockchain-hub/',

  build: {
    outDir: 'dist',        // Vite default — must match 'path:' in deploy.yml
    sourcemap: false,      // set true if you want source maps in production
  },
})
