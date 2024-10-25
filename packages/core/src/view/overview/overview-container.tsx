import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'
import { observer } from 'mobx-react-lite'
import { useInjectable } from '../../hooks/use-di'
import { useLogger } from '../../hooks/use-logger'
import { Demo } from '../../store/demo'
import OverviewView from './overview-view'
import { useState } from 'react'

export default observer(() => {
  const demo = useInjectable(Demo)
  const logger = useLogger()

  const [content, setContent] = useState()

  const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle,
    StarterKit.configure({
      bulletList: {
        keepMarks: true,
        keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      },
      orderedList: {
        keepMarks: true,
        keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
      },
    }),
  ]

  return <OverviewView extensions={extensions} content={content} />
})
