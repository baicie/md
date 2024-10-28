import { EditorContent } from '@tiptap/react'
import { useRef } from 'react'

import { LinkMenu } from '@/tiptap/components/menus'

import { useBlockEditor } from '@/tiptap/hooks/useBlockEditor'

import '@/tiptap/styles/index.css'
import ImageBlockMenu from '@/tiptap/extensions/ImageBlock/components/ImageBlockMenu'
import { ColumnsMenu } from '@/tiptap/extensions/MultiColumn/menus'
import { TableColumnMenu, TableRowMenu } from '@/tiptap/extensions/Table/menus'
import { TextMenu } from '../menus/TextMenu'
import * as Y from 'yjs'
import { TiptapCollabProvider } from '@hocuspocus/provider'

export const BlockEditor = ({
  ydoc,
  provider,
}: {
  ydoc: Y.Doc
  provider?: TiptapCollabProvider | null | undefined
}) => {
  const menuContainerRef = useRef(null)

  const { editor, users } = useBlockEditor({
    ydoc,
    provider,
  })

  if (!editor || !users) {
    return null
  }

  return (
    <div className="flex h-full" ref={menuContainerRef}>
      <div className="relative flex flex-col flex-1 h-full overflow-hidden">
        <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
        <LinkMenu editor={editor} appendTo={menuContainerRef} />
        <TextMenu editor={editor} />
        <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
        <TableRowMenu editor={editor} appendTo={menuContainerRef} />
        <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
        <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
      </div>
    </div>
  )
}

export default BlockEditor
