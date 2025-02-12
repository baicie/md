import { defineComponent } from 'vue'

import type { Editor } from '@tiptap/core'

export const TextMenu = defineComponent({
  name: 'TextMenu',
  props: {
    editor: {
      type: Object as () => Editor,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <div class="absolute bottom-2 left-2 flex gap-1">
        <button
          class="p-2 hover:bg-neutral-100 rounded-lg"
          onClick={() => props.editor.chain().focus().toggleCode().run()}
          data-active={props.editor.isActive('code')}
        >
          代码
        </button>
        <button
          class="p-2 hover:bg-neutral-100 rounded-lg"
          onClick={() => props.editor.chain().focus().toggleBlockquote().run()}
          data-active={props.editor.isActive('blockquote')}
        >
          引用
        </button>
        <button
          class="p-2 hover:bg-neutral-100 rounded-lg"
          onClick={() => props.editor.chain().focus().setHorizontalRule().run()}
        >
          分割线
        </button>
      </div>
    )
  },
})
