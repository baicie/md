import { EditorContent } from '@tiptap/react'
import { useRef } from 'react'

import { LinkMenu } from '@tip/components/menus'

import { useBlockEditor } from '@tip/hooks/useBlockEditor'

import '@tip/styles/index.css'
import '@tip/styles/globals.css'

import ImageBlockMenu from '@tip/extensions/ImageBlock/components/ImageBlockMenu'
import { ColumnsMenu } from '@tip/extensions/MultiColumn/menus'
import { TableColumnMenu, TableRowMenu } from '@tip/extensions/Table/menus'
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
