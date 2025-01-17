import type { ThemeCapability } from '../types'

export class WebTheme implements ThemeCapability {
  current() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }

  toggle() {
    document.documentElement.classList.toggle('dark')
  }

  subscribe(callback: (theme: 'dark' | 'light') => void) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      callback(e.matches ? 'dark' : 'light')
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }
}
