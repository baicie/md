import { Markdown as MarkdownExtension } from '@baicie/md-extension-markdown'

export const Markdown = MarkdownExtension.configure({
  transformPastedText: true,
  transformCopiedText: true,
})
