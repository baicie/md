import path from 'node:path'
import swc from 'unplugin-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineProject } from 'vitest/config'

export default defineProject({
  test: {
    include: ['**/__tests__/**/*.{js,jsx,ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**'],
    testTimeout: 20000,
    isolate: false,
    globals: true,
    setupFiles: ['./test/setup.ts'],
    environment: 'jsdom',
  },
  esbuild: {
    target: 'node18',
  },
  publicDir: false,
  plugins: [
    swc.vite({
      module: { type: 'es6' },
      jsc: {
        transform: {
          react: {
            runtime: 'automatic',
          },
        },
      },
    }) as any,
    tsconfigPaths() as any,
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
