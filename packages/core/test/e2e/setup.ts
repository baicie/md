import path from 'node:path'

import { chromium } from 'playwright-chromium'
import { createServer, loadConfigFromFile, mergeConfig } from 'vite'
import { beforeAll, inject } from 'vitest'

import type * as http from 'node:http'
import type { Browser, Page } from 'playwright-chromium'
import type { RollupError, RollupWatcher, RollupWatcherEvent } from 'rollup'
import type {
  ConfigEnv,
  InlineConfig,
  Logger,
  ResolvedConfig,
  UserConfig,
  ViteDevServer,
} from 'vite'
import type { RunnerTestFile } from 'vitest'

// #region env

export const workspaceRoot = path.resolve(__dirname, '../')

export const isBuild = !!process.env.VITE_TEST_BUILD
export const isServe = !isBuild
export const isWindows = process.platform === 'win32'

// #endregion

// #region context

let server: ViteDevServer | http.Server

/**
 * Vite Dev Server when testing serve
 */
export let viteServer: ViteDevServer
/**
 * Root of the Vite fixture
 */
export let rootDir: string
/**
 * Path to the current test file
 */
export let testPath: string
/**
 * Path to the test folder
 */
export let testDir: string
/**
 * Test folder name
 */
export let testName: string

export const serverLogs: string[] = []
export const browserLogs: string[] = []
export const browserErrors: Error[] = []

export const resolvedConfig: ResolvedConfig = undefined!

export let page: Page = undefined!
export let browser: Browser = undefined!
export let viteTestUrl = ''
export const watcher: RollupWatcher | undefined = undefined

export function setViteUrl(url: string): void {
  viteTestUrl = url
}

// #endregion

beforeAll(async (s) => {
  const suite = s as RunnerTestFile

  testPath = suite.filepath!
  testDir = path.dirname(testPath)

  const wsEndpoint = inject('wsEndpoint')
  if (!wsEndpoint) {
    throw new Error('wsEndpoint not found')
  }

  browser = await chromium.connect(wsEndpoint)
  page = await browser.newPage()

  const globalConsole = global.console
  const warn = globalConsole.warn
  globalConsole.warn = (msg, ...args) => {
    // suppress @vue/reactivity-transform warning
    if (msg.includes('@vue/reactivity-transform')) return
    if (msg.includes('Generated an empty chunk')) return
    warn.call(globalConsole, msg, ...args)
  }

  try {
    page.on('console', (msg) => {
      // ignore favicon request in headed browser
      if (
        process.env.VITE_DEBUG_SERVE &&
        msg.text().includes('Failed to load resource:') &&
        msg.location().url.includes('favicon.ico')
      ) {
        return
      }
      browserLogs.push(msg.text())
    })
    page.on('pageerror', (error) => {
      browserErrors.push(error)
    })

    if (testDir) {
      rootDir = path.dirname(testDir)
    }

    await startDefaultServe()
  } catch (e) {
    // Closing the page since an error in the setup, for example a runtime error
    // when building the playground should skip further tests.
    // If the page remains open, a command like `await page.click(...)` produces
    // a timeout with an exception that hides the real error in the console.
    await page.close()
    await server?.close()
    throw e
  }

  return async () => {
    serverLogs.length = 0
    await page?.close()
    await server?.close()
    if (browser) {
      await browser.close()
    }
  }
})
async function loadConfig(configEnv: ConfigEnv) {
  let config: UserConfig | null = null

  // config file from test root dir
  if (!config) {
    const res = await loadConfigFromFile(configEnv, undefined, rootDir)
    if (res) {
      config = res.config
    }
  }

  const options: InlineConfig = {
    root: rootDir,
    logLevel: 'silent',
    configFile: false,
    server: {
      watch: {
        // During tests we edit the files too fast and sometimes chokidar
        // misses change events, so enforce polling for consistency
        usePolling: true,
        interval: 100,
      },
      fs: {
        strict: !isBuild,
      },
    },
    css: {
      postcss: path.resolve(rootDir, 'postcss.config.js'),
    },
    build: {
      // esbuild do not minify ES lib output since that would remove pure annotations and break tree-shaking
      // skip transpilation during tests to make it faster
      target: 'esnext',
      // tests are flaky when `emptyOutDir` is `true`
      emptyOutDir: false,
    },
    customLogger: createInMemoryLogger(serverLogs),
  }
  return mergeConfig(options, config || {})
}

export async function startDefaultServe(): Promise<void> {
  setupConsoleWarnCollector(serverLogs)

  process.env.VITE_INLINE = 'inline-serve'
  const config = await loadConfig({ command: 'serve', mode: 'development' })
  viteServer = server = await (await createServer(config)).listen()
  viteTestUrl = server.resolvedUrls?.local[0] || ''
  if (server.config.base === '/') {
    viteTestUrl = viteTestUrl.replace(/\/$/, '')
  }
  await page.goto(viteTestUrl)
}

/**
 * Send the rebuild complete message in build watch
 */
export async function notifyRebuildComplete(
  watcher: RollupWatcher,
): Promise<RollupWatcher> {
  let resolveFn: undefined | (() => void)
  const callback = (event: RollupWatcherEvent): void => {
    if (event.code === 'END') {
      resolveFn?.()
    }
  }
  watcher.on('event', callback)
  await new Promise<void>((resolve) => {
    resolveFn = resolve
  })
  return watcher.off('event', callback)
}

export function createInMemoryLogger(logs: string[]): Logger {
  const loggedErrors = new WeakSet<Error | RollupError>()
  const warnedMessages = new Set<string>()

  const logger: Logger = {
    hasWarned: false,
    hasErrorLogged: (err) => loggedErrors.has(err),
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    clearScreen: () => {},
    info(msg) {
      logs.push(msg)
    },
    warn(msg) {
      logs.push(msg)
      logger.hasWarned = true
    },
    warnOnce(msg) {
      if (warnedMessages.has(msg)) return
      logs.push(msg)
      logger.hasWarned = true
      warnedMessages.add(msg)
    },
    error(msg, opts) {
      logs.push(msg)
      if (opts?.error) {
        loggedErrors.add(opts.error)
      }
    },
  }

  return logger
}

function setupConsoleWarnCollector(logs: string[]) {
  // eslint-disable-next-line no-console
  const warn = console.warn
  // eslint-disable-next-line no-console
  console.warn = (...args) => {
    logs.push(args.join(' '))
    return warn.call(console, ...args)
  }
}

export function slash(p: string): string {
  return p.replace(/\\/g, '/')
}

declare module 'vite' {
  export interface UserConfig {
    /**
     * special test only hook
     *
     * runs after build and before preview
     */
    __test__?: () => void
  }
}

declare module 'vitest' {
  export interface ProvidedContext {
    wsEndpoint: string
  }
}
