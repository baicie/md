import { WebPlatform } from '../web'
import { WebLogger } from '../web/logger'
import { DesktopFileSystem } from './fs'
import { DesktopStorage } from './storage'

export class DesktopPlatform extends WebPlatform {
  logger = new WebLogger()
  fs = new DesktopFileSystem(this.logger)
  storage = new DesktopStorage(this.logger)
}
