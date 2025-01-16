import { defineConfig } from 'vitest/config'

const timeout = process.env.PWDEBUG ? Infinity : process.env.CI ? 50000 : 30000

export default defineConfig({
  test: {
    include: ['./e2e/**/*.spec.[tj]s'],
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
