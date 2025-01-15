import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineProject } from 'vitest/config'

export default defineProject({
  test: {
    include: ['**/__tests__/**/*.{js,jsx,ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
    testTimeout: 20000,
    isolate: false,
    globals: true,
    setupFiles: ['./test/setup.ts'],
    environment: 'happy-dom',
  },
  esbuild: {
    target: 'node18',
  },
  publicDir: false,
  plugins: [react() as any],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  define: {
    __DEV__: false,
  },
})
