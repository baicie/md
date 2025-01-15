import { act, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { useThemeStore } from '../theme'

describe('Theme Store', () => {
  beforeEach(() => {
    // 清理 DOM 和 localStorage
    document.documentElement.classList.remove('dark')
    localStorage.clear()

    // 重置 store
    useThemeStore.setState({ theme: 'light' })
  })

  it('should toggle theme', async () => {
    const { toggleTheme } = useThemeStore.getState()

    act(() => {
      toggleTheme()
    })

    await waitFor(() => {
      expect(useThemeStore.getState().theme).toBe('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    act(() => {
      toggleTheme()
    })
    await waitFor(() => {
      expect(useThemeStore.getState().theme).toBe('light')
      expect(document.documentElement.classList.contains('light')).toBe(false)
    })
  })

  it('should persist theme preference', () => {
    const store = useThemeStore.getState()
    store.setTheme('dark')

    // 验证 localStorage
    const saved = JSON.parse(localStorage.getItem('theme-storage') || '{}')
    expect(saved.state.theme).toBe('dark')
  })
})
