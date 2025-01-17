import type { PlatformCapabilities } from './types'

export async function createPlatform(): Promise<PlatformCapabilities> {
  let platform: PlatformCapabilities

  switch (__PLATFORM__) {
    case 'web': {
      const { WebPlatform } = await import('./web/index')
      platform = new WebPlatform()
      break
    }
    // case 'desktop': {
    //   const { TauriPlatform } = await import('./tauri/index')
    //   platform = new TauriPlatform()
    //   break
    // }
  }

  return platform!
}
