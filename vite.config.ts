import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://piuscores.arroweclip.se',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Loguj co proxy posílá
            console.log('Proxy request headers:', proxyReq.getHeaders());
          });
        }
      }
    }
  }
})