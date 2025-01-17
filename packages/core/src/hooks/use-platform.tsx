import { createContext, useContext } from 'react'

import type { PlatformCapabilities } from '@/platform/types'

const PlatformContext = createContext<PlatformCapabilities | null>(null)

export function PlatformProvider({
  children,
  platform,
}: {
  children: React.ReactNode
  platform: PlatformCapabilities | null
}) {
  return (
    <PlatformContext.Provider value={platform}>
      {children}
    </PlatformContext.Provider>
  )
}

export function usePlatform(): PlatformCapabilities {
  const platform = useContext(PlatformContext)
  if (!platform) {
    throw new Error('usePlatform must be used within a PlatformProvider')
  }
  return platform
}
