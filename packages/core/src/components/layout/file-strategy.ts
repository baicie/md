import { useMemo } from 'react'

import type {
  FileNode,
  FileTypeNode,
  LoggerCapability,
  ReadDirResult,
  StorageCapability,
} from '@/platform/types'

import { usePlatform } from '@/hooks/use-platform'
import { storageKeys } from '@/lib/constants'
import { addPrefix } from '@/lib/prefix'
import { readDirRecursive } from '@/platform/desktop/fs'

interface FileStorageStrategy {
  /**
   * @desc 保存文件列表 与文件map<path, file content>
   * @descEN save file list and file map<path, file content>
   */
  saveFiles(result: ReadDirResult): Promise<void>
  /**
   * @desc 加载文件列表
   * @descEN load file list
   */
  loadFilesTree(): Promise<FileNode[]>
  /**
   * @desc 保存文件
   * @descEN save file
   */
  saveFile(path: string, newContent: string): Promise<void>
  /**
   * @desc 加载文件
   * @descEN load file
   */
  loadFile(path: string): Promise<File | null>
}
interface FileStore {
  content: Uint8Array | string
  lastModified: number
  type: string
}

class WebFileStorage implements FileStorageStrategy {
  constructor(
    private readonly storage: StorageCapability,
    private readonly logger: LoggerCapability,
  ) {}

  async saveFiles(result: ReadDirResult): Promise<void> {
    await this.storage.set(storageKeys.files, result.tree)
    for (const [path, file] of result.fileMap) {
      await this.storage.set(addPrefix(storageKeys['file-raw'], path), file)
    }
  }

  async loadFilesTree(): Promise<FileNode[]> {
    return (await this.storage.get<FileNode[]>(storageKeys.files)) || []
  }

  async saveFile(path: string, newContent: string): Promise<void> {
    const fileData = await this.storage.get<File>(
      addPrefix(storageKeys['file-raw'], path),
    )
    if (!fileData) {
      throw new Error(`File not found: ${path}`)
    }

    const updatedData: FileStore = {
      ...fileData,
      content: newContent,
      lastModified: Date.now(),
    }

    const file = new File([newContent], path.split('/').pop() || 'untitled', {
      type: fileData.type,
      lastModified: updatedData.lastModified,
    })

    await this.storage.set(addPrefix(storageKeys['file-raw'], path), file)
  }

  async loadFile(path: string): Promise<File | null> {
    this.logger.debug('loadFile', path)
    return await this.storage.get<File>(
      addPrefix(storageKeys['file-raw'], path),
    )
  }
}

class DesktopFileStorage implements FileStorageStrategy {
  constructor(
    private readonly storage: StorageCapability,
    private readonly logger: LoggerCapability,
  ) {}

  async saveFiles(result: ReadDirResult): Promise<void> {
    const history =
      (await this.storage.get<string[]>(storageKeys['open-history'])) || []
    const historySet = new Set(history)

    if (result.selectedPath) {
      historySet.add(result.selectedPath)
      this.logger.debug('historySet', historySet)
      await this.storage.set(storageKeys['open-history'], [...historySet])
    }
  }

  async loadFilesTree(): Promise<FileNode[]> {
    const history =
      (await this.storage.get<string[]>(storageKeys['open-history'])) || []
    if (!history.length) {
      return []
    }
    return readDirRecursive(history[0])
  }

  async saveFile(file: FileTypeNode): Promise<void> {
    if (!file.raw) {
      this.logger.error('File raw content is missing')
      return
    }
    const content = await file.raw.arrayBuffer()
    await this.storage.set(file.path, new Uint8Array(content))
  }

  async loadFile(path: string): Promise<File | null> {
    return await this.storage.get<File>(
      addPrefix(storageKeys['file-raw'], path),
    )
  }
}

export const useFileStorageStrategy = () => {
  const { storage, logger } = usePlatform()

  return useMemo(
    () =>
      __PLATFORM__ === 'desktop'
        ? new DesktopFileStorage(storage, logger)
        : new WebFileStorage(storage, logger),
    [storage, logger],
  )
}
