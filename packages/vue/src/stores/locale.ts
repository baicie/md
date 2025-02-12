import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import { defaultLocale, locales, type LocaleType } from '@/config/locale'

export const useLocaleStore = defineStore('locale', () => {
  const { locale: i18nLocale } = useI18n()
  const locale = ref<LocaleType>(defaultLocale.key)

  // 初始化时同步i18n的locale
  locale.value = i18nLocale.value as LocaleType

  const setLocale = (newLocale: LocaleType) => {
    locale.value = newLocale
    i18nLocale.value = newLocale
  }

  const getCurrentLocale = () => {
    return locales.find((l) => l.key === locale.value) || defaultLocale
  }

  return {
    locale,
    locales,
    setLocale,
    getCurrentLocale,
  }
})
