import { useCallback, useEffect, useMemo, useState } from 'react'

import type { FileNode } from '@/platform/types'

import { usePlatform } from '@/hooks/use-platform'
import { storageKeys } from '@/lib/constants'
import { readDirRecursive } from '@/platform/desktop/fs'

interface FileStorageStrategy {
  saveFiles(files: FileNode[], selectedPath: string | null): Promise<void>
  loadFiles(): Promise<FileNode[]>
}

const useFileStorageStrategy = () => {
  const { storage, logger } = usePlatform()

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
    }

    return __PLATFORM__ === 'desktop' ? desktopStrategy : webStrategy
  }, [storage, logger])
}

export const useLayout = () => {
  const { logger } = usePlatform()
  const [files, setFiles] = useState<FileNode[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const strategy = useFileStorageStrategy()

  const handleFileSelect = useCallback(
    async (selectedFiles: FileNode[], selectedPath: string | null) => {
      try {
        setIsLoading(true)
        logger.debug('开始保存文件...', { count: selectedFiles.length })

        // 立即更新UI
        setFiles(selectedFiles)

        // 异步保存文件
        await strategy.saveFiles(selectedFiles, selectedPath)
        logger.debug('文件保存成功')
      } catch (error) {
        logger.error('保存文件失败:', error)
        // 如果保存失败，回滚状态
        setFiles([])
      } finally {
        setIsLoading(false)
      }
    },
    [strategy, logger],
  )

  // 初始化加载
  useEffect(() => {
    let mounted = true

    const initFiles = async () => {
      if (!mounted) return

      try {
        setIsLoading(true)
        const loadedFiles = await strategy.loadFiles()
        if (mounted) {
          setFiles(loadedFiles)
          logger.debug('文件加载成功', { count: loadedFiles.length })
        }
      } catch (error) {
        logger.error('加载文件失败:', error)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    initFiles()

    return () => {
      mounted = false
    }
  }, [strategy, logger])

  return {
    files,
    isLoading,
    handleFileSelect,
  }
}
