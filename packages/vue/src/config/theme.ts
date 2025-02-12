import { darkTheme, lightTheme } from 'naive-ui'

import type { GlobalTheme } from 'naive-ui'

export type ThemeType = 'light' | 'dark'

export interface ThemeConfig {
  name: string
  key: ThemeType
  theme: GlobalTheme
}

export const themes: ThemeConfig[] = [
  {
    name: '浅色',
    key: 'light',
    theme: lightTheme,
  },
  {
    name: '深色',
    key: 'dark',
    theme: darkTheme,
  },
]

export const defaultTheme = themes[0]
