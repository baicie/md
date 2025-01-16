import path from 'node:path'

import { execa } from 'execa'
import killPort from 'kill-port'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export let tauriDriver: any

export async function setup() {
  // 先确保端口被释放
  try {
    await killPort(4444)
    await killPort(4445)
  } catch (_) {
    //
  }

  //   spawnSync('cargo', ['build', '--release'])
  // 启动 tauri-driver
  // await execa('cargo', ['install', 'tauri-driver'])

  tauriDriver = execa('tauri-driver', [
    '--native-driver',
    path.join('D:', 'downloads', 'edgedriver_win64', 'msedgedriver.exe'),
  ])
}

export async function teardown(): Promise<void> {
  tauriDriver.kill()
  // 清理端口
  await killPort(4444)
  await killPort(4445)
}