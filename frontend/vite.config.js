import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/samoa-pacific-blockchain-hub/',  // GitHub Pages repo name
})
