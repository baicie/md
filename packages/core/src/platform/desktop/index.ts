import { WebLogger } from '../web/logger'
import { DesktopFileSystem } from './fs'

export class DesktopPlatform {
  logger = new WebLogger()
  fs = new DesktopFileSystem(this.logger)
}
