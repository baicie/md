import { WebPlatform } from '../web'
import { WebLogger } from '../web/logger'
import { DesktopFileSystem } from './fs'

export class DesktopPlatform extends WebPlatform {
  logger = new WebLogger()
  fs = new DesktopFileSystem(this.logger)
}
