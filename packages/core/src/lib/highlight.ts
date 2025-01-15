import hljs from 'highlight.js/lib/core'
import markdown from 'highlight.js/lib/languages/markdown'

hljs.registerLanguage('markdown', markdown)

import 'highlight.js/scss/github.scss'

export const highlight = (code: string) => {
  return hljs.highlight(code, { language: 'markdown' }).value
}

export default highlight
