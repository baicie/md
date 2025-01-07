import { defineConfig, defineWorkspace } from 'vitest/config'

const commonConfig = defineConfig({
  test: {
    include: ['**/__tests__/**/*.e2e.spec.[tj]s'],
    exclude: ['**/node_modules/**', '**/dist/**', 'servers/api/**'],
    testTimeout: 20000,
    isolate: false,
    globals: true,
    deps: {
      interopDefault: true,
    },
  },
  esbuild: {
    target: 'node18',
  },
  publicDir: false,
})

// defineWorkspace 会提供一个很好的类型提示开发体验
export default defineWorkspace([
  'servers/api/vitest.config.e2e.ts',
  'servers/client/vitest.config.e2e.ts',
  {
    root: 'servers/cli',
    ...commonConfig,
  },
])
