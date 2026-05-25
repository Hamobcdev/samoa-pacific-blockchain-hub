import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5180,
    proxy: { '/api': { target: 'http://localhost:3001', changeOrigin: true } },
    historyApiFallback: true,
  },
  build:  { outDir: 'dist' },
  optimizeDeps: {
    include: ['three', 'tone', 'ethers'],
  },
})
