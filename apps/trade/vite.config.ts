import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  server: { port: 5186, host: true },
  resolve: {
    alias: { '@': resolve(__dirname, 'src') },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor:    ['react', 'react-dom'],
          contracts: ['@samoa-dpi/contracts-abi'],
          ethers:    ['ethers'],
          qrcode:    ['qrcode'],
        },
      },
    },
  },
})
