import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { logger } from '@/lib/logger'

interface ThemeState {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
  toggleTheme: () => void
}

// 初始化时立即应用保存的主题
const initializeTheme = () => {
  const savedState = localStorage.getItem('theme-storage')
  if (savedState) {
    try {
      const { state } = JSON.parse(savedState)
      if (state?.theme) {
        updateTheme(state.theme)
        return state.theme
      }
    } catch (_e) {
      logger.error('Failed to parse saved theme')
    }
  }

  // 如果没有保存的主题，使用系统主题
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const theme = isDark ? 'dark' : 'light'
  updateTheme(theme)
  return theme
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: initializeTheme(),
      setTheme: (theme) => {
        updateTheme(theme)
        set({ theme })
      },
      toggleTheme: () =>
        set((state) => {
          const theme = state.theme === 'dark' ? 'light' : 'dark'
          updateTheme(theme)
          return { theme }
        }),
    }),
    {
      name: 'theme-storage',
    },
  ),
)

function updateTheme(theme: 'light' | 'dark') {
  const root = window.document.documentElement
  root.classList.toggle('dark', theme === 'dark')
}

if (typeof window !== 'undefined') {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme-storage')) {
      useThemeStore.getState().setTheme(e.matches ? 'dark' : 'light')
    }
  })
}
