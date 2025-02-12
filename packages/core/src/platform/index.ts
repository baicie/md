import type { PlatformCapabilities } from './types'

interface PlatformFactory {
  createPlatform(): Promise<PlatformCapabilities>
}

class WebPlatformFactory implements PlatformFactory {
  async createPlatform(): Promise<PlatformCapabilities> {
    const { WebPlatform } = await import('./web/index')
    return new WebPlatform()
  }
}

class DesktopPlatformFactory implements PlatformFactory {
  async createPlatform(): Promise<PlatformCapabilities> {
    const { DesktopPlatform } = await import('./desktop/index')
    return new DesktopPlatform()
  }
}

const platformFactories: Record<string, PlatformFactory> = {
  web: new WebPlatformFactory(),
  desktop: new DesktopPlatformFactory(),
}

export async function createPlatform(): Promise<PlatformCapabilities> {
  const factory = platformFactories[__PLATFORM__]
  if (!factory) {
    throw new Error(`不支持的平台类型: ${__PLATFORM__}`)
  }
  return factory.createPlatform()
}
