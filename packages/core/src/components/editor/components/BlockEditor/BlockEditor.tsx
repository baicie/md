import { EditorContent } from '@tiptap/react'
import { useEffect, useRef, useState } from 'react'

import { ContentItemMenu } from '../menus/ContentItemMenu'
import { LinkMenu } from '../menus/LinkMenu'
import { TextMenu } from '../menus/TextMenu'
import { EditorToolbar } from '../Toolbar'

import type { TiptapCollabProvider } from '@hocuspocus/provider'
import type * as Y from 'yjs'

import '@/styles/index.css'

import { Sidebar } from '@/components/editor/components/Sidebar'
import { ImageBlockMenu } from '@/components/editor/extensions/ImageBlock/components/ImageBlockMenu'
import { ColumnsMenu } from '@/components/editor/extensions/MultiColumn/menus'
import {
  TableColumnMenu,
  TableRowMenu,
} from '@/components/editor/extensions/Table/menus'
import { useBlockEditor } from '@/hooks/useBlockEditor'
import { useSidebar } from '@/hooks/useSidebar'
import { ScrollArea } from '@/components/ui/scroll-area'

export const BlockEditor = ({
  ydoc,
  provider,
}: {
  ydoc: Y.Doc | null
  provider?: TiptapCollabProvider | null | undefined
}) => {
  const menuContainerRef = useRef(null)
  const [isMounted, setIsMounted] = useState(false)

  const leftSidebar = useSidebar()
  const { editor, users } = useBlockEditor({ ydoc, provider })

  useEffect(() => {
    setIsMounted(true)
    return () => {
      editor?.destroy()
    }
  }, [editor])

  if (!isMounted || !editor || !users) {
    return null
  }

  return (
    <div className="flex h-full" ref={menuContainerRef}>
      <Sidebar
        isOpen={leftSidebar.isOpen}
        onClose={leftSidebar.close}
        editor={editor}
      />
      <div className="relative flex flex-col flex-1 h-full overflow-hidden">
        <EditorToolbar editor={editor} />
        <ScrollArea className="flex-1 w-full p-4">
          <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
          <ContentItemMenu editor={editor} />
          <LinkMenu editor={editor} appendTo={menuContainerRef} />
          <TextMenu editor={editor} />
          <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
          <TableRowMenu editor={editor} appendTo={menuContainerRef} />
          <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
          <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
        </ScrollArea>
      </div>
    </div>
  )
}

export default BlockEditor
