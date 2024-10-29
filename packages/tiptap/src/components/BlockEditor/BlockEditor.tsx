import { EditorContent } from '@tiptap/react'
import { useRef } from 'react'

import { LinkMenu } from '@/components/menus'

import { useBlockEditor } from '@/hooks/useBlockEditor'

import '@/styles/index.css'
import '@/styles/globals.css'

import ImageBlockMenu from '@/extensions/ImageBlock/components/ImageBlockMenu'
import { ColumnsMenu } from '@/extensions/MultiColumn/menus'
import { TableColumnMenu, TableRowMenu } from '@/extensions/Table/menus'
import * as Y from 'yjs'
import { TextMenu } from '../menus/TextMenu'

export const BlockEditor = ({ ydoc }: { ydoc?: Y.Doc }) => {
  const menuContainerRef = useRef(null)

  const { editor, users } = useBlockEditor({ ydoc })

  if (!editor || !users) {
    return null
  }

  return (
    <div className="flex flex-col flex-1 h-full overflow-hidden">
      <EditorContent editor={editor} className="flex-1 overflow-y-auto" />
      <LinkMenu editor={editor} appendTo={menuContainerRef} />
      <TextMenu editor={editor} />
      <ColumnsMenu editor={editor} appendTo={menuContainerRef} />
      <TableRowMenu editor={editor} appendTo={menuContainerRef} />
      <TableColumnMenu editor={editor} appendTo={menuContainerRef} />
      <ImageBlockMenu editor={editor} appendTo={menuContainerRef} />
    </div>
  )
}

export default BlockEditor
