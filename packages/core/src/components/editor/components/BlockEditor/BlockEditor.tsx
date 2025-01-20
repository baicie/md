import { EditorContent } from '@tiptap/react'
import { useRef } from 'react'

import { ContentItemMenu } from '../menus/ContentItemMenu'
import { LinkMenu } from '../menus/LinkMenu'
import { TextMenu } from '../menus/TextMenu'
import { EditorToolbar } from '../Toolbar'

import type { Editor } from '@tiptap/react'

import '@/styles/index.css'

import { Sidebar } from '@/components/editor/components/Sidebar'
import { ImageBlockMenu } from '@/components/editor/extensions/ImageBlock/components/ImageBlockMenu'
import { ColumnsMenu } from '@/components/editor/extensions/MultiColumn/menus'
import {
  TableColumnMenu,
  TableRowMenu,
} from '@/components/editor/extensions/Table/menus'
import { useSidebar } from '@/hooks/use-sidebar'

export const BlockEditor = ({
  editor,
  isReady = true,
}: {
  editor: Editor | null
  isReady?: boolean
}) => {
  const menuContainerRef = useRef(null)
  const leftSidebar = useSidebar()

  if (!isReady || !editor) {
    return (
      <div className="flex h-full items-center justify-center">
        Loading editor...
      </div>
    )
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
        <div className="flex-1 w-full overflow-y-auto p-4">
          <EditorContent editor={editor} className="h-full w-full" />
          <ContentItemMenu editor={editor} />
          <LinkMenu editor={editor} appendTo={menuContainerRef} />
          <TextMenu editor={editor} />
          <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
          <TableRowMenu editor={editor} appendTo={menuContainerRef} />
          <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
          <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
        </div>
      </div>
    </div>
  )
}

export default BlockEditor
