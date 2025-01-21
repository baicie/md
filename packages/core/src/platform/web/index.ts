import { WebClipboard } from './clipboard'
import { WebFileSystem } from './fs'
import { WebLogger } from './logger'
import { WebNetwork } from './network'
import { WebStorage } from './storage'
import { WebSystem } from './system'
import { WebTheme } from './theme'

import type { PlatformCapabilities } from '../types'

export class WebPlatform implements PlatformCapabilities {
  theme = new WebTheme()
  clipboard = new WebClipboard()
  network = new WebNetwork()
  system = new WebSystem()
  logger = new WebLogger({
    level: import.meta.env.DEV ? 'debug' : 'info',
    prefix: __APP_NAME__,
  })
  fs = new WebFileSystem(this.logger)
  storage = new WebStorage(this.logger)
}
