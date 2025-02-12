import type { NetworkCapability } from '../types'

export class WebNetwork implements NetworkCapability {
  isOnline() {
    return navigator.onLine
  }

  subscribe(callback: (online: boolean) => void) {
    window.addEventListener('online', () => callback(true))
    window.addEventListener('offline', () => callback(false))
    return () => {
      window.removeEventListener('online', () => callback(true))
      window.removeEventListener('offline', () => callback(false))
    }
  }
}
