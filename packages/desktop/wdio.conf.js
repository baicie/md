import { spawn } from 'child_process'
import process from 'node:process'
import { homedir } from 'os'
import { resolve } from 'path'

// keep track of the `tauri-driver` child process
let tauriDriver

export const config = {
  specs: ['./e2e/*.js'],
  maxInstances: 1,
  capabilities: [
    {
      maxInstances: 1,
      browserName: 'edge',
      'tauri:options': {
        application: 'D:/workspace/git-code/md/target/release/md-desktop.exe',
      },
    },
  ],
  reporters: ['spec'],
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },

  //   // ensure the rust project is built since we expect this binary to exist for the webdriver sessions
  //   onPrepare: () => spawnSync('cargo', ['build', '--release']),

  // ensure we are running `tauri-driver` before the session starts so that we can proxy the webdriver requests
  beforeSession: () =>
    (tauriDriver = spawn(
      resolve(homedir(), '.cargo', 'bin', 'tauri-driver'),
      [],
      { stdio: [null, process.stdout, process.stderr] },
    )),

  // clean up the `tauri-driver` process we spawned at the start of the session
  afterSession: () => tauriDriver.kill(),
}
