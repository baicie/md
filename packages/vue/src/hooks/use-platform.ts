import { inject } from 'vue'

import type { PlatformCapabilities } from '@/platform/types'
import type { App, InjectionKey } from 'vue'

const PLATFORM_KEY: InjectionKey<PlatformCapabilities> = Symbol('platform')

export function usePlatform(): PlatformCapabilities {
  const platform = inject(PLATFORM_KEY)
  if (!platform) {
    throw new Error('usePlatform must be used within a PlatformProvider')
  }
  return platform
}

export function createPlatformProvider(platform: PlatformCapabilities) {
  return {
    install(app: App) {
      app.provide(PLATFORM_KEY, platform)
    },
  }
}
