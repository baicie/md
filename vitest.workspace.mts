import { configDefaults, defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  './packages/web/vitest.config.ts',
  {
    extends: './packages/desktop/vitest.config.ts',
    test: {
      name: 'desktop',
      root: './packages/desktop',
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      exclude: [...configDefaults.exclude],
    },
  },
  {
    extends: './servers/api/vitest.config.ts',
    test: {
      name: 'api',
      root: './servers/api',
      environment: 'node',
      include: ['src/**/*.{test,spec}.ts'],
      exclude: [...configDefaults.exclude],
    },
  },
])
