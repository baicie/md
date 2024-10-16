import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'node:path'
import pkg from './package.json'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    minify: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/main.tsx'),
      output: {
        dir: path.resolve(__dirname, 'dist'),
        entryFileNames: 'main.js',
        format: 'es',
      },
      external: [...Object.keys(pkg.dependencies)],
    },
  },
})
