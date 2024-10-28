import { Icon } from '@/tiptap/components/ui/Icon'
import { Toolbar } from '@/tiptap/components/ui/Toolbar'
import { Editor } from '@tiptap/react'

import * as Popover from '@radix-ui/react-popover'
import { Surface } from '@/tiptap/components/ui/Surface'
import { DropdownButton } from '@/tiptap/components/ui/Dropdown'
import useContentItemActions from './hooks/useContentItemActions'
import { useData } from './hooks/useData'
import { useEffect, useState } from 'react'

export type ContentItemMenuProps = {
  editor: Editor
}

export const ContentItemMenu = ({ editor }: ContentItemMenuProps) => {
  const [menuOpen, setMenuOpen] = useState(false)
  const data = useData()
  const actions = useContentItemActions(
    editor,
    data.currentNode,
    data.currentNodePos,
  )

  useEffect(() => {
    if (menuOpen) {
      editor.commands.setMeta('lockDragHandle', true)
    } else {
      editor.commands.setMeta('lockDragHandle', false)
    }
  }, [editor, menuOpen])

  return <div>DragHandle</div>
}
