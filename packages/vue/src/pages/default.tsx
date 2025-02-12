import { defineComponent } from 'vue'

import { useFileStore } from '@/stores/file'

export default defineComponent({
  name: 'DefaultPage',
  setup() {
    const { activeFile } = useFileStore()

    return () => {
      if (!activeFile) return null

      return (
        <div class="default-page">
          <div class="default-page-title">不支持的文件类型</div>
          <div class="default-page-filename">{activeFile.name}</div>
        </div>
      )
    }
  },
})
