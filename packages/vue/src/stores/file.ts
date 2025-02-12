import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { FileNode } from '@/platform/types'

export const useFileStore = defineStore('file', () => {
  const activeFile = ref<FileNode | null>(null)
  const files = ref<FileNode[]>([])

  const setActiveFile = (file: FileNode | null) => {
    activeFile.value = file
  }

  const setFiles = (newFiles: FileNode[]) => {
    files.value = newFiles
  }

  return {
    activeFile,
    files,
    setActiveFile,
    setFiles,
  }
})
