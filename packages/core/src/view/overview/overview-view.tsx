import type { ReactElement } from 'react'
import './overview.module.scss'
import { BlockEditor } from '@/tiptap'

interface Props {}

const DemoView = ({}: Props): ReactElement => {
  return <BlockEditor />
}
export default DemoView
