import { defineComponent } from 'vue'

import type { Editor } from '@tiptap/core'

export const TableRowMenu = defineComponent({
  name: 'TableRowMenu',
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
          onClick={() => props.editor.chain().focus().addRowBefore().run()}
        >
          上方插入行
        </button>
        <button
          class="p-2 hover:bg-neutral-100 rounded-lg"
          onClick={() => props.editor.chain().focus().addRowAfter().run()}
        >
          下方插入行
        </button>
        <button
          class="p-2 hover:bg-neutral-100 rounded-lg"
          onClick={() => props.editor.chain().focus().deleteRow().run()}
        >
          删除行
        </button>
      </div>
    )
  },
})

export const TableColumnMenu = defineComponent({
  name: 'TableColumnMenu',
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
          onClick={() => props.editor.chain().focus().addColumnBefore().run()}
        >
          左侧插入列
        </button>
        <button
          class="p-2 hover:bg-neutral-100 rounded-lg"
          onClick={() => props.editor.chain().focus().addColumnAfter().run()}
        >
          右侧插入列
        </button>
        <button
          class="p-2 hover:bg-neutral-100 rounded-lg"
          onClick={() => props.editor.chain().focus().deleteColumn().run()}
        >
          删除列
        </button>
      </div>
    )
  },
})
