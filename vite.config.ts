import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), preact(), tsconfigPaths()],
  server: {
    host: true,
    allowedHosts: true,
    port: parseInt('80'),
  },
})
