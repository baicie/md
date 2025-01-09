import { configDefaults, defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  './packages/web/vitest.config.ts',
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
