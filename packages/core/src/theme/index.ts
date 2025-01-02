import { defaultTheme } from './modules/default'
import { darkTheme } from './modules/dark'

export const themes = {
  default: defaultTheme,
  dark: darkTheme,
}

export type Theme = keyof typeof themes
