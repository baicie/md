import type { DefineLocaleMessage } from 'vue-i18n'

export interface I18nMessages extends DefineLocaleMessage {
  common: {
    save: string
    cancel: string
    confirm: string
    delete: string
    edit: string
    create: string
    openFolder: string
  }
  editor: {
    placeholder: string
    loading: string
  }
}
