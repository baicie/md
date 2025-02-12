import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

import { defaultTheme, themes, type ThemeType } from '@/config/theme'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<ThemeType>(defaultTheme.key)

  // 检测系统主题
  if (typeof window !== 'undefined') {
    const darkMode = window.matchMedia('(prefers-color-scheme: dark)')
    theme.value = darkMode.matches ? 'dark' : 'light'

    darkMode.addEventListener('change', (e) => {
      theme.value = e.matches ? 'dark' : 'light'
    })
  }

  // 监听主题变化，更新HTML类名
  watch(
    theme,
    (newTheme) => {
      const html = document.documentElement
      html.classList.remove('light', 'dark')
      html.classList.add(newTheme)
    },
    { immediate: true },
  )

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  const setTheme = (newTheme: ThemeType) => {
    theme.value = newTheme
  }

  const getCurrentTheme = () => {
    return themes.find((t) => t.key === theme.value) || defaultTheme
  }

  return {
    theme,
    themes,
    toggleTheme,
    setTheme,
    getCurrentTheme,
  }
})
