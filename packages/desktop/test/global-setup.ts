import { execa } from 'execa'
import { Builder, Capabilities, WebDriver } from 'selenium-webdriver'
import { Options } from 'selenium-webdriver/edge'
import { join } from 'node:path'
import killPort from 'kill-port'
import { ChildProcess } from 'node:child_process'

export let tauriDriver: ChildProcess

export async function setup() {
  // 先确保端口被释放
  try {
    await killPort(4444)
    await killPort(4445)
  } catch (error) {
    console.log('No process on ports')
  }

  // 启动 tauri-driver
  // await execa('cargo', ['install', 'tauri-driver'])

  tauriDriver = execa('tauri-driver', [
    '--native-driver',
    join('D:', 'downloads', 'edgedriver_win64', 'msedgedriver.exe'),
  ])

  try {
  } catch (error) {
    tauriDriver.kill()
    throw error
  }
}

export async function teardown(): Promise<void> {
  tauriDriver.kill()
  // 清理端口
  await killPort(4444)
  await killPort(4445)
}
