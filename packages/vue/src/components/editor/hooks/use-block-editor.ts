import { Details } from '@baicie/md-extension-details'
import { DetailsContent } from '@baicie/md-extension-details-content'
import { DetailsSummary } from '@baicie/md-extension-details-summary'
import { Emoji, gitHubEmojis } from '@baicie/md-extension-emoji'
import { FileHandler } from '@baicie/md-extension-file-handler'
import { TableOfContents } from '@baicie/md-extension-table-of-contents'
import { UniqueID } from '@baicie/md-extension-unique-id'
import { Editor } from '@tiptap/core'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import StarterKit from '@tiptap/starter-kit'
import { useEditor } from '@tiptap/vue-3'
import { ref, watch } from 'vue'

import type { TiptapCollabProvider } from '@hocuspocus/provider'
import type { Doc as YDoc } from 'yjs'

export const useBlockEditor = ({
  provider,
}: {
  ydoc: YDoc | null
  provider?: TiptapCollabProvider | null | undefined
}) => {
  const isEditorReady = ref(false)

  const editor = useEditor({
    editable: true,
    injectCSS: true,
    extensions: [
      StarterKit,
      Image,
      Link,
      Table,
      TableRow,
      TableHeader,
      TableCell,
      Details,
      DetailsContent,
      DetailsSummary,
      Emoji.configure({
        emojis: gitHubEmojis,
      }),
      FileHandler,
      TableOfContents,
      UniqueID.configure({
        types: ['heading'],
      }),
    ],
    onCreate: ({ editor }) => {
      if (provider && !provider.isSynced) {
        provider.on('synced', () => {
          isEditorReady.value = true
        })
      } else {
        if (editor.isEmpty) {
          editor.commands.focus('start')
        }
        isEditorReady.value = true
      }
    },
    onDestroy: () => {
      isEditorReady.value = false
    },
  })

  watch(
    () => editor.value,
    (newEditor) => {
      if (newEditor instanceof Editor) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(window as any).editor = newEditor
      }
    },
  )

  return {
    editor,
    isEditorReady,
  }
}
