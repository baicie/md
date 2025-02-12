import { defineComponent } from 'vue'

import { BlockEditor } from './components/block-editor'
import { useBlockEditor } from './hooks/use-block-editor'

export const Editor = defineComponent({
  name: 'Editor',
  setup() {
    const { editor, isEditorReady } = useBlockEditor({
      ydoc: null,
      provider: null,
    })

    return () => (
      <div class="h-full">
        <BlockEditor editor={editor.value} isReady={isEditorReady.value} />
      </div>
    )
  },
})
