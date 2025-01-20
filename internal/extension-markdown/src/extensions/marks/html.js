import { getHTMLFromFragment, Mark } from '@tiptap/core'
import { Fragment } from '@tiptap/pm/model'

export default Mark.create({
  name: 'markdownHTMLMark',
  /**
   * @return {{markdown: MarkdownMarkSpec}}
   */
  addStorage() {
    return {
      markdown: {
        serialize: {
          open(_state, mark) {
            if (!this.editor.storage.markdown.options.html) {
              // eslint-disable-next-line no-console, no-undef
              console.warn(
                `Tiptap Markdown: "${mark.type.name}" mark is only available in html mode`,
              )
              return ''
            }
            return getMarkTags(mark)?.[0] ?? ''
          },
          close(_state, mark) {
            if (!this.editor.storage.markdown.options.html) {
              return ''
            }
            return getMarkTags(mark)?.[1] ?? ''
          },
        },
        parse: {
          // handled by markdown-it
        },
      },
    }
  },
})

function getMarkTags(mark) {
  const schema = mark.type.schema
  const node = schema.text(' ', [mark])
  const html = getHTMLFromFragment(Fragment.from(node), schema)
  const match = html.match(/^(<.*?>) (<\/.*?>)$/)
  return match ? [match[1], match[2]] : null
}
