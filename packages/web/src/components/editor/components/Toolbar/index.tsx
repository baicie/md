import { useEffect, useState } from 'react'

import GROUPS from '../../extensions/SlashCommand/groups'

import type { Editor } from '@tiptap/core'

import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'

interface ToolbarProps {
  editor: Editor | null
}

export const Toolbar = ({ editor }: ToolbarProps) => {
  const [, setForceUpdate] = useState(0)

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

  const allCommands = GROUPS.flatMap((group) => group.commands)

  return (
    <div className="border-b border-border bg-background p-1 flex items-center gap-1">
      {allCommands.map((command) => {
        const isActive = command.isActive?.(editor)
        return (
          <Button
            key={command.name}
            variant="ghost"
            buttonSize="icon"
            onClick={() => command.action(editor)}
            disabled={command.shouldBeHidden?.(editor)}
            active={isActive}
            title={`${command.label} - ${command.description}`}
          >
            <Icon name={command.iconName} className="w-4 h-4" />
          </Button>
        )
      })}
    </div>
  )
}
