import { NButton, NIcon, NTree } from 'naive-ui'
import { defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import type { FileNode } from '@/platform/types'
import type { TreeOption } from 'naive-ui'

import { usePlatform } from '@/hooks/use-platform'
import { useFileStore } from '@/stores/file'

export const FileTree = defineComponent({
  name: 'FileTree',
  setup() {
    const { t } = useI18n()
    const platform = usePlatform()
    const fileStore = useFileStore()
    const files = ref<TreeOption[]>([])

    const handleSelect = async () => {
      try {
        const result = await platform.fs?.readDir()
        if (result) {
          const { files: selectedFiles } = result
          fileStore.setFiles(selectedFiles)
          files.value = selectedFiles.map(fileToTreeNode)
        }
      } catch (e) {
        platform.logger.error('Failed to read directory:', e)
      }
    }

    const fileToTreeNode = (file: FileNode): TreeOption => ({
      key: file.path,
      label: file.name,
      children:
        file.type === 'directory'
          ? file.children?.map(fileToTreeNode)
          : undefined,
    })

    const handleNodeClick = (node: TreeOption) => {
      const file = fileStore.files.find((f) => f.path === node.key)
      if (file && file.type === 'file') {
        fileStore.setActiveFile(file)
      }
    }

    return () => (
      <div class="file-tree">
        <div class="file-tree-header">
          <NButton block onClick={handleSelect}>
            <NIcon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
              </svg>
            </NIcon>
            {t('common.openFolder')}
          </NButton>
        </div>
        <div class="file-tree-content">
          <NTree
            data={files.value}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            onNodeClick={handleNodeClick}
            blockLine
            selectable
          />
        </div>
      </div>
    )
  },
})
