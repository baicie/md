import type { ReactElement } from 'react'
import { EditorProvider, Extensions, Content } from '@tiptap/react'

interface Props {
  extensions?: Extensions
  content?: Content
}

const DemoView = ({ extensions, content }: Props): ReactElement => {
  return (
    <EditorProvider
      // slotBefore={<MenuBar />}
      extensions={extensions}
      content={content}
    ></EditorProvider>
  )
}
export default DemoView
