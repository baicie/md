export interface EditorUser {
  clientId: string
  name: string
  color: string
  initials?: string
}

export interface LanguageOption {
  name: string
  label: string
  value: unknown
}
