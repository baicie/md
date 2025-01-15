import { useEffect, useState } from 'react'

import useGroups from '../../extensions/SlashCommand/groups'

import type { Editor } from '@tiptap/core'

import { Icon } from '@/components/ui/Icon'
import { Toolbar as UIToolbar } from '@/components/ui/Toolbar'

interface EditorToolbarProps {
  editor: Editor | null
}

export const EditorToolbar = ({ editor }: EditorToolbarProps) => {
  const [, setForceUpdate] = useState(0)
  const allCommands = useGroups().flatMap((group) => group.commands)

  useEffect(() => {
    if (!editor) return

    const updateListener = () => {
      setForceUpdate((prev) => prev + 1)
    }

    editor.on('selectionUpdate', updateListener)
    editor.on('update', updateListener)

    return () => {
      editor.off('selectionUpdate', updateListener)
      editor.off('update', updateListener)
    }
  }, [editor])

  if (!editor) return null

  return (
    <div className="border-b border-border bg-background p-1 flex items-center gap-1">
      {allCommands.map((command) => {
        const isActive = command.isActive?.(editor)
        return (
          <UIToolbar.Button
            key={command.name}
            variant="ghost"
            buttonSize="icon"
            onClick={() => command.action(editor)}
            disabled={command.shouldBeHidden?.(editor)}
            active={isActive}
            tooltipShortcut={command.shortcut}
            tooltip={command.label}
          >
            <Icon name={command.iconName} className="w-4 h-4" />
          </UIToolbar.Button>
        )
      })}
    </div>
  )
}
