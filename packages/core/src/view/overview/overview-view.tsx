import type { ReactElement } from 'react'
import '@toast-ui/editor/dist/toastui-editor.css'
import { TFunction } from 'i18next'
import { Editor } from '@toast-ui/react-editor'

interface Props {
  msg: string
  onClick: () => void
  t: TFunction<'translation', undefined>
}

const DemoView = ({ msg, onClick, t }: Props): ReactElement => (
  <Editor initialEditType="wysiwyg" />
)
export default DemoView
