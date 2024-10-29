import type { ReactElement } from 'react'
import './overview.module.scss'
import { BlockEditor } from '@baicie/md-tiptap'
import '@baicie/md-tiptap/style'

interface Props {}

const DemoView = ({}: Props): ReactElement => {
  return <BlockEditor />
}
export default DemoView
