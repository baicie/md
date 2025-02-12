import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [
      path.resolve(__dirname, '__tests__/utils/setup.js'),
      path.resolve(__dirname, '__tests__/utils/setup-dom.js'),
    ],
  },
  esbuild: {
    target: 'node18',
  },
})
