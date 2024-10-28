import type { ReactElement } from 'react'
import { Extensions, Content } from '@tiptap/react'
import './overview.module.scss'
import TipTap from '@/tiptap/app/page'

interface Props {
  extensions?: Extensions
  content?: Content
}

const DemoView = ({ extensions, content }: Props): ReactElement => {
  return <TipTap />
}
export default DemoView
