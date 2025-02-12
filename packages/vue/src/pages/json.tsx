import { defineComponent } from 'vue'

import type { FileTypeNode } from '@/platform/types'

import { useFileStore } from '@/stores/file'

export default defineComponent({
  name: 'JsonPage',
  setup() {
    const { activeFile } = useFileStore()

    return () => {
      if (!activeFile) return null

      try {
        const content = new TextDecoder().decode(
          (activeFile as FileTypeNode).content,
        )
        const jsonData = JSON.parse(content)
        return (
          <pre class="json-content">{JSON.stringify(jsonData, null, 2)}</pre>
        )
      } catch (_) {
        return <div class="json-error">无效的 JSON 文件</div>
      }
    }
  },
})
