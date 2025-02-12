import { WebSocketStatus } from '@hocuspocus/provider'
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'
import { useEditor, useEditorState } from '@tiptap/react'
import { useEffect, useState } from 'react'

import { userColors, userNames } from '../lib/constants'

import type { TiptapCollabProvider } from '@hocuspocus/provider'
import type { AnyExtension, Editor } from '@tiptap/core'
import type { Doc as YDoc } from 'yjs'
import type { EditorUser } from '../components/editor/components/BlockEditor/types'

import { ExtensionKit } from '@/components/editor/extensions/extension-kit'
import { randomElement } from '@/lib/utils/index'

declare global {
  interface Window {
    editor: Editor | null
  }
}

export const useBlockEditor = ({
  ydoc,
  provider,
}: {
  ydoc: YDoc | null
  provider?: TiptapCollabProvider | null | undefined
}) => {
  const [collabState, setCollabState] = useState<WebSocketStatus>(
    provider ? WebSocketStatus.Connecting : WebSocketStatus.Disconnected,
  )
  const [isEditorReady, setIsEditorReady] = useState(false)

  const editor = useEditor(
    {
      editable: true,
      injectCSS: true,
      onCreate: ({ editor }) => {
        if (provider && !provider.isSynced) {
          provider.on('synced', () => {
            setIsEditorReady(true)
          })
        } else {
          if (editor.isEmpty) {
            editor.commands.focus('start', { scrollIntoView: true })
          }
          setIsEditorReady(true)
        }
      },
      onDestroy: () => {
        setIsEditorReady(false)
      },
      extensions: [
        ...ExtensionKit({
          provider,
        }).filter((e) => e !== undefined),
        provider && ydoc
          ? Collaboration.configure({
              document: ydoc,
            })
          : undefined,
        provider
          ? CollaborationCursor.configure({
              provider,
              user: {
                name: randomElement(userNames),
                color: randomElement(userColors),
              },
            })
          : undefined,
      ].filter((e): e is AnyExtension => e !== undefined),
      editorProps: {
        attributes: {
          autocomplete: 'off',
          autocorrect: 'off',
          autocapitalize: 'off',
          class: 'min-h-full',
        },
      },
    },
    [ydoc, provider],
  )

  const users = useEditorState({
    editor,
    selector: (ctx): (EditorUser & { initials: string })[] => {
      if (!ctx.editor?.storage.collaborationCursor?.users) {
        return []
      }

      return ctx.editor.storage.collaborationCursor.users.map(
        (user: EditorUser) => {
          const names = user.name?.split(' ')
          const firstName = names?.[0]
          const lastName = names?.[names.length - 1]
          const initials = `${firstName?.[0] || '?'}${lastName?.[0] || '?'}`

          return { ...user, initials: initials.length ? initials : '?' }
        },
      )
    },
  })

  useEffect(() => {
    provider?.on('status', (event: { status: WebSocketStatus }) => {
      setCollabState(event.status)
    })

    return () => {
      editor?.destroy()
    }
  }, [provider, editor])

  window.editor = editor

  return { editor, users, collabState, isEditorReady }
}
