import { enUS, zhCN } from 'naive-ui'

import type { NLocale } from 'naive-ui'

export type LocaleType = 'zh-CN' | 'en-US'

export interface LocaleConfig {
  name: string
  key: LocaleType
  locale: NLocale
}

export const locales: LocaleConfig[] = [
  {
    name: '简体中文',
    key: 'zh-CN',
    locale: zhCN,
  },
  {
    name: 'English',
    key: 'en-US',
    locale: enUS,
  },
]

export const defaultLocale = locales[0]
