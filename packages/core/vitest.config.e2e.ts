import { resolve } from 'node:path'

import { defineConfig } from 'vitest/config'

const timeout = process.env.PWDEBUG ? Infinity : process.env.CI ? 50000 : 30000

export default defineConfig({
  resolve: {
    alias: {
      '~utils': resolve(__dirname, './test/utils'),
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
  test: {
    include: ['./e2e/**/*.spec.[tj]s'],
    setupFiles: ['./test/e2e/setup.ts'],
    globalSetup: ['./test/e2e/global-setup.ts'],
    testTimeout: timeout,
    hookTimeout: timeout,
    reporters: 'dot',
    deps: {
      // Prevent Vitest from running the workspace packages in Vite's SSR runtime
      moduleDirectories: ['node_modules', 'packages'],
    },
    onConsoleLog(log) {
      if (
        log.match(
          /experimental|jit engine|emitted file|tailwind|The CJS build of Vite/i,
        )
      )
        return false
    },
  },
  esbuild: {
    target: 'node18',
  },
  publicDir: false,
})
