import { WebLogger } from '../web/logger'
import { WebToast } from '../web/toast'
import { DesktopFileSystem } from './fs'
import { DesktopStorage } from './storage'

import type { PlatformCapabilities } from '../types'

export class DesktopPlatform implements PlatformCapabilities {
  logger = new WebLogger({
    level: import.meta.env.DEV ? 'debug' : 'info',
    prefix: __APP_NAME__,
  })
  fs = new DesktopFileSystem(this.logger)
  storage = new DesktopStorage(this.logger)
  toast = new WebToast()
}
