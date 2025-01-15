import prettier from 'prettier/standalone'
import markdown from 'prettier/parser-markdown'

import type { Editor } from '@tiptap/react'

export const formatContent = (editor: Editor) => {
  try {
    // 获取 markdown 内容
    const content = editor.storage.markdown.getMarkdown()

    // 使用 prettier 格式化
    const formatted = prettier.format(content, {
      parser: 'markdown',
      plugins: [markdown],
      proseWrap: 'always',
      printWidth: 80,
      tabWidth: 2,
    })

    // 更新编辑器内容
    editor.commands.setContent(formatted, true)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Format error:', error)
  }
}
