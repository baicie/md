import type { ReactElement } from 'react'
import './overview.module.scss'
import { BlockEditor } from '@/tiptap'

interface Props {}

const DemoView = ({}: Props): ReactElement => {
  return (
    <div style={{ padding: '0 44px' }}>
      <BlockEditor />
    </div>
  )
}
export default DemoView
