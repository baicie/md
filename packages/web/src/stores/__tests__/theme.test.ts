import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useThemeStore } from '../theme'

describe('Theme Store', () => {
  beforeEach(() => {
    // 清理 DOM 和 localStorage
    document.documentElement.classList.remove('dark')
    localStorage.clear()

    // 重置 store
    useThemeStore.setState({ theme: 'light' })
  })

  it('should initialize with system preference', () => {
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      value: vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      })),
    })

    const store = useThemeStore.getState()
    expect(store.theme).toBe('dark')
  })

  it('should toggle theme', () => {
    const store = useThemeStore.getState()

    store.toggleTheme()
    expect(store.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    store.toggleTheme()
    expect(store.theme).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('should persist theme preference', () => {
    const store = useThemeStore.getState()
    store.setTheme('dark')

    // 验证 localStorage
    const saved = JSON.parse(localStorage.getItem('theme-storage') || '{}')
    expect(saved.state.theme).toBe('dark')
  })
})
