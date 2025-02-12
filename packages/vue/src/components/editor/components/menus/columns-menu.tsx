import { defineComponent } from 'vue'

import type { Editor } from '@tiptap/core'

export const ColumnsMenu = defineComponent({
  name: 'ColumnsMenu',
  props: {
    editor: {
      type: Object as () => Editor,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <div class="absolute bottom-2 right-2 flex gap-1">
        <button
          class="p-2 hover:bg-neutral-100 rounded-lg"
          onClick={() => props.editor.chain().focus().setColumns(2).run()}
        >
          两列
        </button>
        <button
          class="p-2 hover:bg-neutral-100 rounded-lg"
          onClick={() => props.editor.chain().focus().setColumns(3).run()}
        >
          三列
        </button>
      </div>
    )
  },
})
