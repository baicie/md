import { defineComponent } from 'vue'

import { useFileStore } from '@/stores/file'

export default defineComponent({
  name: 'TextPage',
  setup() {
    const { activeFile } = useFileStore()

    return () => {
      if (!activeFile) return null

      const content = new TextDecoder().decode(activeFile.content)
      return <pre class="text-content">{content}</pre>
    }
  },
})
