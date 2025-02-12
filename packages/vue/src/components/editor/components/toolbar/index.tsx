import { defineComponent } from 'vue'

import type { Editor } from '@tiptap/core'

export const EditorToolbar = defineComponent({
  name: 'EditorToolbar',
  props: {
    editor: {
      type: Object as () => Editor,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <div class="flex items-center p-2 border-b gap-1">
        <button
          class="p-2 hover:bg-neutral-100 rounded-lg"
          onClick={() => props.editor.chain().focus().toggleBold().run()}
          data-active={props.editor.isActive('bold')}
        >
          加粗
        </button>
        <button
          class="p-2 hover:bg-neutral-100 rounded-lg"
          onClick={() => props.editor.chain().focus().toggleItalic().run()}
          data-active={props.editor.isActive('italic')}
        >
          斜体
        </button>
        <button
          class="p-2 hover:bg-neutral-100 rounded-lg"
          onClick={() => props.editor.chain().focus().toggleStrike().run()}
          data-active={props.editor.isActive('strike')}
        >
          删除线
        </button>
      </div>
    )
  },
})
