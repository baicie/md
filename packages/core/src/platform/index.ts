import type { PlatformCapabilities } from './types'

export async function createPlatform(): Promise<PlatformCapabilities> {
  let platform: PlatformCapabilities

  switch (__PLATFORM__) {
    case 'web': {
      const { WebPlatform } = await import('./web/index')
      platform = new WebPlatform()
      break
    }
    case 'desktop': {
      const { DesktopPlatform } = await import('./desktop/index')
      platform = new DesktopPlatform()
      break
    }
  }

  return platform!
}
