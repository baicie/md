import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { Builder, Capabilities } from 'selenium-webdriver'
import { beforeAll } from 'vitest'

import type { WebDriver } from 'selenium-webdriver'

export let driver: WebDriver

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const application = path.resolve(
  __dirname,
  '../../../',
  'target/release/',
  'md-desktop',
)

beforeAll(async () => {
  const capabilities = new Capabilities()
  capabilities.set('tauri:options', { application })
  capabilities.setBrowserName('wry')

  // start the webdriver client
  driver = await new Builder()
    .withCapabilities(capabilities)
    .usingServer('http://127.0.0.1:4444/')
    .build()
})

declare module 'vitest' {
  export interface ProvidedContext {
    driver: WebDriver
  }
}
