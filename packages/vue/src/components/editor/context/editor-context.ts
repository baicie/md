import type { Editor } from '@tiptap/core'
import type { InjectionKey, Ref } from 'vue'

export const contextKey = Symbol('editor-context') as InjectionKey<{
  editor: Editor | null
  isEditorReady: Ref<boolean>
}>
