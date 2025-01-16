import { execa } from 'execa'
import killPort from 'kill-port'

import type { ChildProcess } from 'node:child_process'

export let tauriDriver: ChildProcess

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

  tauriDriver = execa('tauri-driver', [])
}

export async function teardown(): Promise<void> {
  tauriDriver.kill()
  // 清理端口
  await killPort(4444)
  await killPort(4445)
}
