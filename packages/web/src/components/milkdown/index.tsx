import { Editor, rootCtx, defaultValueCtx } from '@milkdown/core'
import { math } from '@milkdown/plugin-math'
import { commonmark } from '@milkdown/preset-commonmark'
import { nord } from '@milkdown/theme-nord'
import { useEffect } from 'react'
import '@milkdown/theme-nord/style.css'

const MyEditor = () => {
  useEffect(() => {
    Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, document.getElementById('editor'))
        ctx.set(defaultValueCtx, '# Hello Milkdown')
      })
      .config(nord)
      .use(commonmark)
      .use(math)
      .create()
  }, [])

  return <div id="editor" />
}

export default MyEditor
