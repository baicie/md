import { defineComponent, ref } from 'vue'

import type { Editor } from '@tiptap/core'

export const LinkMenu = defineComponent({
  name: 'LinkMenu',
  props: {
    editor: {
      type: Object as () => Editor,
      required: true,
    },
  },
  setup(props) {
    const url = ref('')
    const showInput = ref(false)

    const setLink = () => {
      if (url.value) {
        props.editor.chain().focus().setLink({ href: url.value }).run()
      }
      showInput.value = false
      url.value = ''
    }

    return () => (
      <div class="absolute top-2 right-2 flex gap-1">
        {showInput.value ? (
          <div class="flex gap-1">
            <input
              class="px-2 py-1 border rounded"
              type="text"
              v-model={url.value}
              placeholder="输入链接地址"
              onKeydown={(e) => e.key === 'Enter' && setLink()}
            />
            <button
              class="p-2 hover:bg-neutral-100 rounded-lg"
              onClick={setLink}
            >
              确定
            </button>
          </div>
        ) : (
          <button
            class="p-2 hover:bg-neutral-100 rounded-lg"
            onClick={() => (showInput.value = true)}
            data-active={props.editor.isActive('link')}
          >
            链接
          </button>
        )}
      </div>
    )
  },
})
