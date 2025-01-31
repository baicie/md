import { useMemo } from 'react'

import type { FileNode, FileTypeNode } from '@/platform/types'

import { usePlatform } from '@/hooks/use-platform'
import { storageKeys } from '@/lib/constants'
import { readDirRecursive } from '@/platform/desktop/fs'

interface FileStorageStrategy {
  saveFiles(files: FileNode[], selectedPath: string | null): Promise<void>
  loadFiles(): Promise<FileNode[]>
  saveFile(activeFile: FileTypeNode): Promise<void>
}

export const useFileStorageStrategy = () => {
  const { storage, logger, fs } = usePlatform()

  return useMemo(() => {
    const webStrategy: FileStorageStrategy = {
      async saveFiles(files: FileNode[]) {
        // Web 端保存完整的文件内容
        await storage.set(storageKeys.files, files)
      },
      async loadFiles() {
        // Web 端直接从 storage 加载完整文件
        return (await storage.get<FileNode[]>(storageKeys.files)) || []
      },
      async saveFile(file) {
        await fs?.writeFile(file.path, file.content)
      },
    }

    const desktopStrategy: FileStorageStrategy = {
      async saveFiles(_files: FileNode[], selectedPath: string | null) {
        const history =
          (await storage.get<string[]>(storageKeys['open-history'])) || []

        const historySet = new Set(history)
        if (selectedPath) {
          historySet.add(selectedPath)
          logger.debug('historySet', historySet)
          await storage.set(storageKeys['open-history'], [...historySet])
        }
      },
      async loadFiles() {
        const history =
          (await storage.get<string[]>(storageKeys['open-history'])) || []
        return (await readDirRecursive(history[0])) || []
      },
      async saveFile(file) {
        await fs?.writeFile(file.path, file.content)
      },
    }

    return __PLATFORM__ === 'desktop' ? desktopStrategy : webStrategy
  }, [storage, logger, fs])
}
