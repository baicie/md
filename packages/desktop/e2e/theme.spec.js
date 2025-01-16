// import { spawn } from 'node:child_process'
// import os from 'node:os'
// import path, { resolve } from 'node:path'

// import killPort from 'kill-port'
// import { Builder, Capabilities } from 'selenium-webdriver'
// import { afterAll, beforeAll, describe, expect, it } from 'vitest'

// import type { ChildProcess } from 'node:child_process'
// import type { WebDriver } from 'selenium-webdriver'

// const application = resolve(__dirname, '../../../target/release/md-desktop.exe')

// let driver: WebDriver
// let tauriDriver: ChildProcess

// describe('Tauri WebDriver Test', () => {
//   beforeAll(async () => {
//     await killPort(4445)
//     // ensure the program has been built
//     // spawnSync('cargo', ['build', '--release'])

//     // start tauri-driver
//     tauriDriver = spawn(
//       path.resolve(os.homedir(), '.cargo', 'bin', 'tauri-driver'),
//       [
//         '--port',
//         '4444',
//         '--native-driver',
//         path.join('D:', 'downloads', 'edgedriver_win64', 'msedgedriver.exe'),
//       ],
//       { stdio: 'inherit' },
//     )

//     const capabilities = Capabilities.edge().set('ms:edgeOptions', {
//       args: ['--start-maximized'],
//       excludeSwitches: ['enable-logging'],
//     })
//     capabilities.set('tauri:options', { application })

//     driver = await new Builder()
//       .forBrowser('MicrosoftEdge')
//       .withCapabilities(capabilities)
//       .usingServer('http://localhost:4445')
//       .build()
//   })

//   afterAll(async () => {
//     tauriDriver.kill()
//     await driver.quit()
//   })

//   function sleep(ms: number) {
//     return new Promise((resolve) => setTimeout(resolve, ms * 1000))
//   }

//   it('should load the application', async () => {
//     await sleep(50)
//     const title = await driver.getTitle()
//     console.log('title', title)

//     expect(title).toBe('Hello Tauri')
//   })
// })
// calculates the luma from a hex color `#abcdef`
import { $ } from '@wdio/globals'

function luma(hex) {
  if (hex.startsWith('#')) {
    hex = hex.substring(1)
  }

  const rgb = parseInt(hex, 16)
  const r = (rgb >> 16) & 0xff
  const g = (rgb >> 8) & 0xff
  const b = (rgb >> 0) & 0xff
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

describe('Hello Tauri', () => {
  it('should be cordial', async () => {
    const header = await $('body > h1')
    const text = await header.getText()
    expect(text).toMatch(/^[hH]ello/)
  })

  it('should be excited', async () => {
    const header = await $('body > h1')
    const text = await header.getText()
    expect(text).toMatch(/!$/)
  })

  it('should be easy on the eyes', async () => {
    const body = await $('body')
    const backgroundColor = await body.getCSSProperty('background-color')
    expect(luma(backgroundColor.parsed.hex)).toBeLessThan(100)
  })
})
