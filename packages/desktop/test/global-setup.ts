import { spawn, spawnSync } from 'node:child_process'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { Builder, Capabilities } from 'selenium-webdriver'

import type { ChildProcessByStdio } from 'child_process'
import type { WebDriver } from 'selenium-webdriver'
import type { Writable } from 'stream'
import type { GlobalSetupContext } from 'vitest/node'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const application = path.resolve(
  __dirname,
  '../../../',
  'target/release/',
  'md-desktop',
)

// keep track of the webdriver instance we create
export let driver: WebDriver

// keep track of the tauri-driver process we start
let tauriDriver: ChildProcessByStdio<Writable, null, null>

export async function setup({
  provide: _provide,
}: GlobalSetupContext): Promise<void> {
  spawnSync('cargo', ['build', '--release'])

  tauriDriver = spawn(
    path.resolve(os.homedir(), '.cargo', 'bin', 'tauri-driver'),
    [],
    { stdio: [null, process.stdout, process.stderr] },
  )

  const capabilities = new Capabilities()
  capabilities.set('tauri:options', { application })
  capabilities.setBrowserName('wry')

  // start the webdriver client
  driver = await new Builder()
    .withCapabilities(capabilities)
    .usingServer('http://127.0.0.1:4444/')
    .build()
}

export async function teardown(): Promise<void> {
  await driver.quit()
  tauriDriver.kill()
}
