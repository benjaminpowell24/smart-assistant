import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({mode}) => {
    const env = loadEnv(mode, process.cwd())

  return {
     base: '/smart-assistant/',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/v1': {
        target: env.VITE_API_URL,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/v1/, ''), // Optional: Remove "/api" prefix if needed
      },
    },
  },
  }
 
})

