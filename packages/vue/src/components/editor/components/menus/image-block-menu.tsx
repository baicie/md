import { defineComponent } from 'vue'

import type { Editor } from '@tiptap/core'

export const ImageBlockMenu = defineComponent({
  name: 'ImageBlockMenu',
  props: {
    editor: {
      type: Object as () => Editor,
      required: true,
    },
  },
  setup(props) {
    const addImage = () => {
      const url = window.prompt('输入图片地址')
      if (url) {
        props.editor.chain().focus().setImage({ src: url }).run()
      }
    }

    return () => (
      <div class="absolute bottom-2 right-2 flex gap-1">
        <button
          class="p-2 hover:bg-neutral-100 rounded-lg"
          onClick={addImage}
          data-active={props.editor.isActive('image')}
        >
          插入图片
        </button>
      </div>
    )
  },
})
