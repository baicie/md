import { defineComponent } from 'vue'

import type { Editor } from '@tiptap/core'

export const ContentItemMenu = defineComponent({
  name: 'ContentItemMenu',
  props: {
    editor: {
      type: Object as () => Editor,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <div class="absolute top-2 left-2 flex gap-1">
        <button
          class="p-2 hover:bg-neutral-100 rounded-lg"
          onClick={() =>
            props.editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          data-active={props.editor.isActive('heading', { level: 1 })}
        >
          标题1
        </button>
        <button
          class="p-2 hover:bg-neutral-100 rounded-lg"
          onClick={() =>
            props.editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          data-active={props.editor.isActive('heading', { level: 2 })}
        >
          标题2
        </button>
        <button
          class="p-2 hover:bg-neutral-100 rounded-lg"
          onClick={() => props.editor.chain().focus().toggleBulletList().run()}
          data-active={props.editor.isActive('bulletList')}
        >
          无序列表
        </button>
        <button
          class="p-2 hover:bg-neutral-100 rounded-lg"
          onClick={() => props.editor.chain().focus().toggleOrderedList().run()}
          data-active={props.editor.isActive('orderedList')}
        >
          有序列表
        </button>
      </div>
    )
  },
})
