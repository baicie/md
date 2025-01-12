import { mergeAttributes } from '@tiptap/core'
import TiptapHeading from '@tiptap/extension-heading'

import type { Level } from '@tiptap/extension-heading'

export const Heading = TiptapHeading.extend({
  renderHTML({ node, HTMLAttributes }) {
    const nodeLevel = parseInt(node.attrs.level, 10) as Level
    const hasLevel = this.options.levels.includes(nodeLevel)
    const level = hasLevel ? nodeLevel : this.options.levels[0]

    return [
      `h${level}`,
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ]
  },
  addKeyboardShortcuts() {
    return {
      'Mod-1': () => this.editor.chain().focus().setHeading({ level: 1 }).run(),
      'Mod-2': () => this.editor.chain().focus().setHeading({ level: 2 }).run(),
      'Mod-3': () => this.editor.chain().focus().setHeading({ level: 3 }).run(),
      // 'Mod-4': () => this.editor.chain().focus().setHeading({ level: 4 }).run(),
      // 'Mod-5': () => this.editor.chain().focus().setHeading({ level: 5 }).run(),
      // 'Mod-6': () => this.editor.chain().focus().setHeading({ level: 6 }).run(),
    }
  },
})

export default Heading
