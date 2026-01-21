import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { name } from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __APP_NAME__: JSON.stringify(name),
  },
  plugins: [
    react(),
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html.replace('%VITE_APP_TITLE%', name)
      },
    },
  ],
  server: {
    cors: true,
  },
})
