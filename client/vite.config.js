import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Use a relative base so built assets reference the HTML file's folder.
  // This avoids absolute `/assets/...` paths which can cause 404s on some hosts
  // (especially when the app is served from a subpath or via certain CDNs).
  base: './',
  plugins: [react()],
})
