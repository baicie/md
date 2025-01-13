/* eslint-disable @typescript-eslint/no-explicit-any */
// test utils used in e2e tests for playgrounds.
// `import { getColor } from '~utils'`

import fs from 'node:fs'
import path from 'node:path'

import { fromComment } from 'convert-source-map'
import colors from 'css-color-names'
import { normalizePath } from 'vite'
import { expect } from 'vitest'

import { isWindows, page, testDir } from './e2e/setup'

import type { ResultPromise as ExecaResultPromise } from 'execa'
import type {
  ConsoleMessage,
  ElementHandle,
  Locator,
} from 'playwright-chromium'
import type { DepOptimizationMetadata, Manifest } from 'vite'
import type { Assertion } from 'vitest'

export * from './e2e/setup'

const hexToNameMap: Record<string, string> = {}
Object.keys(colors).forEach((color) => {
  hexToNameMap[colors[color as keyof typeof colors]] = color
})

function componentToHex(c: number): string {
  const hex = c.toString(16)
  return hex.length === 1 ? '0' + hex : hex
}

function rgbToHex(rgb: string): string {
  const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  if (match) {
    const [_, rs, gs, bs] = match
    return (
      '#' +
      componentToHex(parseInt(rs, 10)) +
      componentToHex(parseInt(gs, 10)) +
      componentToHex(parseInt(bs, 10))
    )
  } else {
    return '#000000'
  }
}

const timeout = (n: number) => new Promise((r) => setTimeout(r, n))

async function toEl(
  el: string | ElementHandle | Locator,
): Promise<ElementHandle> {
  if (typeof el === 'string') {
    const realEl = await page.$(el)
    if (realEl == null) {
      throw new Error(`Cannot find element: "${el}"`)
    }
    return realEl
  }
  if ('elementHandle' in el) {
    return el.elementHandle() as any
  }
  return el
}

export async function getColor(
  el: string | ElementHandle | Locator,
): Promise<string> {
  el = await toEl(el)
  const rgb = await el.evaluate((el) => getComputedStyle(el as Element).color)
  return hexToNameMap[rgbToHex(rgb)] ?? rgb
}

export async function getBg(
  el: string | ElementHandle | Locator,
): Promise<string> {
  el = await toEl(el)
  return el.evaluate((el) => getComputedStyle(el as Element).backgroundImage)
}

export async function getBgColor(
  el: string | ElementHandle | Locator,
): Promise<string> {
  el = await toEl(el)
  return el.evaluate((el) => getComputedStyle(el as Element).backgroundColor)
}

export function readFile(filename: string): string {
  return fs.readFileSync(path.resolve(testDir, filename), 'utf-8')
}

export function editFile(
  filename: string,
  replacer: (str: string) => string,
): void {
  filename = path.resolve(testDir, filename)
  const content = fs.readFileSync(filename, 'utf-8')
  const modified = replacer(content)
  fs.writeFileSync(filename, modified)
}

export function addFile(filename: string, content: string): void {
  const resolvedFilename = path.resolve(testDir, filename)
  fs.mkdirSync(path.dirname(resolvedFilename), { recursive: true })
  fs.writeFileSync(resolvedFilename, content)
}

export function removeFile(filename: string): void {
  fs.unlinkSync(path.resolve(testDir, filename))
}

export function listAssets(base = ''): string[] {
  const assetsDir = path.join(testDir, 'dist', base, 'assets')
  return fs.readdirSync(assetsDir)
}

export function findAssetFile(
  match: string | RegExp,
  base = '',
  assets = 'assets',
  matchAll = false,
): string {
  const assetsDir = path.join(testDir, 'dist', base, assets)
  let files: string[]
  try {
    files = fs.readdirSync(assetsDir)
  } catch (e: unknown) {
    if ((e as { code?: string }).code === 'ENOENT') {
      return ''
    }
    throw e
  }

  if (matchAll) {
    const matchedFiles = files.filter((file) => file.match(match))
    return matchedFiles.length
      ? matchedFiles
          .map((file) =>
            fs.readFileSync(path.resolve(assetsDir, file), 'utf-8'),
          )
          .join('')
      : ''
  } else {
    const matchedFile = files.find((file) => file.match(match))
    return matchedFile
      ? fs.readFileSync(path.resolve(assetsDir, matchedFile), 'utf-8')
      : ''
  }
}

export function readManifest(base = ''): Manifest {
  return JSON.parse(
    fs.readFileSync(
      path.join(testDir, 'dist', base, '.vite/manifest.json'),
      'utf-8',
    ),
  )
}

export function readDepOptimizationMetadata(
  environmentName = 'client',
): DepOptimizationMetadata {
  const suffix = environmentName === 'client' ? '' : `_${environmentName}`
  return JSON.parse(
    fs.readFileSync(
      path.join(testDir, `node_modules/.vite/deps${suffix}/_metadata.json`),
      'utf-8',
    ),
  )
}

/**
 * Poll a getter until the value it returns includes the expected value.
 */
export async function untilUpdated(
  poll: () => string | Promise<string>,
  expected: string | RegExp,
): Promise<void> {
  const maxTries = process.env.CI ? 200 : 50
  for (let tries = 0; tries < maxTries; tries++) {
    const actual = (await poll()) ?? ''
    if (
      (typeof expected === 'string'
        ? actual.indexOf(expected) > -1
        : actual.match(expected)) ||
      tries === maxTries - 1
    ) {
      expect(actual).toMatch(expected)
      break
    } else {
      await timeout(50)
    }
  }
}

/**
 * Retry `func` until it does not throw error.
 */
export async function withRetry(func: () => Promise<void>): Promise<void> {
  const maxTries = process.env.CI ? 200 : 50
  for (let tries = 0; tries < maxTries; tries++) {
    try {
      await func()
      return
    } catch {
      //
    }
    await timeout(50)
  }
  await func()
}

export const expectWithRetry = <T>(getActual: () => Promise<T>) => {
  return new Proxy(
    {},
    {
      get(_target, key: string | symbol) {
        if (typeof key !== 'string') return undefined
        return async (...args: unknown[]) => {
          await withRetry(async () => {
            const assertion = expect(await getActual()) as any
            return assertion[key](...args)
          })
        }
      },
    },
  ) as Assertion<T>['resolves']
}

type UntilBrowserLogAfterCallback = (logs: string[]) => PromiseLike<void> | void

export async function untilBrowserLogAfter(
  operation: () => any,
  target: string | RegExp | (string | RegExp)[],
  expectOrder?: boolean,
  callback?: UntilBrowserLogAfterCallback,
): Promise<string[]>
export async function untilBrowserLogAfter(
  operation: () => any,
  target: string | RegExp | (string | RegExp)[],
  callback?: UntilBrowserLogAfterCallback,
): Promise<string[]>
export async function untilBrowserLogAfter(
  operation: () => any,
  target: string | RegExp | (string | RegExp)[],
  arg3?: boolean | UntilBrowserLogAfterCallback,
  arg4?: UntilBrowserLogAfterCallback,
): Promise<string[]> {
  const expectOrder = typeof arg3 === 'boolean' ? arg3 : false
  const callback = typeof arg3 === 'boolean' ? arg4 : arg3

  const promise = untilBrowserLog(target, expectOrder)
  await operation()
  const logs = await promise
  if (callback) {
    await callback(logs)
  }
  return logs
}

async function untilBrowserLog(
  target?: string | RegExp | (string | RegExp)[],
  expectOrder = true,
): Promise<string[]> {
  const { promise, resolve, reject } = promiseWithResolvers<void>()

  const logs: string[] | PromiseLike<string[]> = []

  try {
    const isMatch = (matcher: string | RegExp) => (text: string) =>
      typeof matcher === 'string' ? text === matcher : matcher.test(text)

    let processMsg: (text: string) => boolean

    if (!target) {
      processMsg = () => true
    } else if (Array.isArray(target)) {
      if (expectOrder) {
        const remainingTargets = [...target]
        processMsg = (text: string) => {
          const nextTarget = remainingTargets.shift()
          expect(text).toMatch(nextTarget!)
          return remainingTargets.length === 0
        }
      } else {
        const remainingMatchers = target.map(isMatch)
        processMsg = (text: string) => {
          const nextIndex = remainingMatchers.findIndex((matcher) =>
            matcher(text),
          )
          if (nextIndex >= 0) {
            remainingMatchers.splice(nextIndex, 1)
          }
          return remainingMatchers.length === 0
        }
      }
    } else {
      processMsg = isMatch(target)
    }

    const handleMsg = (msg: ConsoleMessage) => {
      try {
        const text = msg.text()
        logs.push(text)
        const done = processMsg(text)
        if (done) {
          resolve()
        }
      } catch (err) {
        reject(err)
      }
    }

    page.on('console', handleMsg)
  } catch (err) {
    reject(err)
  }

  await promise

  return logs
}

export const extractSourcemap = (content: string): any => {
  const lines = content.trim().split('\n')
  return fromComment(lines[lines.length - 1]).toObject()
}

export const formatSourcemapForSnapshot = (map: any): any => {
  const root = normalizePath(testDir)
  const m = { ...map }
  delete m.file
  delete m.names
  m.sources = m.sources.map((source: string) => source.replace(root, '/root'))
  if (m.sourceRoot) {
    m.sourceRoot = m.sourceRoot.replace(root, '/root')
  }
  return m
}

// helper function to kill process, uses taskkill on windows to ensure child process is killed too
export async function killProcess(
  serverProcess: ExecaResultPromise,
): Promise<void> {
  if (isWindows) {
    try {
      const { execaCommandSync } = await import('execa')
      execaCommandSync(`taskkill /pid ${serverProcess.pid} /T /F`)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('failed to taskkill:', e)
    }
  } else {
    serverProcess.kill('SIGTERM')
  }
}

export interface PromiseWithResolvers<T> {
  promise: Promise<T>
  resolve: (value: T | PromiseLike<T>) => void
  reject: (reason?: any) => void
}
export function promiseWithResolvers<T>(): PromiseWithResolvers<T> {
  let resolve: any
  let reject: any
  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })
  return { promise, resolve, reject }
}
