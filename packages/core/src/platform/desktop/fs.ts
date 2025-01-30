import { basename, dirname, join, resolve } from '@tauri-apps/api/path'
import { open } from '@tauri-apps/plugin-dialog'
import {
  create,
  exists,
  readDir,
  readFile,
  writeFile,
} from '@tauri-apps/plugin-fs'

import type { FileNode, FileSystemCapability, LoggerCapability } from '../types'

export async function readDirRecursive(basePath: string): Promise<FileNode[]> {
  const result: FileNode[] = []

  const entries = await readDir(basePath)

  for (const entry of entries) {
    if (entry.name.startsWith('.')) {
      continue
    }
    const fullPath = await resolve(basePath, entry.name)
    if (entry.isDirectory) {
      result.push({
        name: entry.name,
        type: 'directory',
        children: await readDirRecursive(fullPath),
        path: fullPath,
      })
    } else if (entry.isFile) {
      const content = await readFile(fullPath)
      result.push({
        name: entry.name,
        type: 'file',
        path: fullPath,
        content,
        raw: new File([content], entry.name),
      })
    }
  }

  return result
}
export class DesktopFileSystem implements FileSystemCapability {
  constructor(private readonly logger: LoggerCapability) {}

  async readFile(filePath: string): Promise<Uint8Array> {
    try {
      const content = await readFile(filePath)
      return new Uint8Array(Buffer.from(content))
    } catch (e) {
      this.logger.error('Failed to read file:', e)
      throw e
    }
  }

  async writeFile(filePath: string, data: Uint8Array): Promise<void> {
    try {
      await writeFile(filePath, data)
    } catch (e) {
      this.logger.error('Failed to write file:', e)
      throw e
    }
  }

  async exists(filePath: string): Promise<boolean> {
    try {
      return await exists(filePath)
    } catch {
      return false
    }
  }

  // async readDir(dirPath = ''): Promise<FileNode[]> {
  //   try {
  //     const entries = await readDir(dirPath, {
  //       baseDir: BaseDirectory.Download,
  //     })

  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     return entries.map((entry) => entry.name) as any
  //   } catch (e) {
  //     this.logger.error('Failed to read directory:', e)
  //     throw e
  //   }
  // }

  async createDir(dirPath: string): Promise<void> {
    try {
      await create(dirPath)
    } catch (e) {
      this.logger.error('Failed to create directory:', e)
      throw e
    }
  }

  async readFiles(options?: {
    types?: {
      description?: string
      accept: Record<string, string[]>
    }[]
  }): Promise<FileNode[]> {
    try {
      this.logger.debug('📂 Starting readFiles', {
        description: options?.types?.[0]?.description,
        accept: options?.types?.[0]?.accept,
      })

      const selected = await open({
        multiple: true,
        filters: options?.types?.map((type) => ({
          name: type.description || '',
          extensions: Object.values(type.accept)
            .flat()
            .map((ext) => ext.replace('.', '')),
        })),
      })

      if (!selected) return []

      const filePaths = Array.isArray(selected) ? selected : [selected]

      const files = await Promise.all(
        filePaths.map(async (filePath) => {
          const content = await readFile(filePath)
          const name = await basename(filePath)
          const data = new Uint8Array(Buffer.from(content))

          if (data.length === 0) {
            this.logger.warn('⚠️ File is empty:', name)
          }

          this.logger.debug(`📄 File loaded:`, {
            name,
            size: `${(data.length / 1024).toFixed(2)} KB`,
          })

          return {
            name,
            type: 'file' as const,
            path: filePath,
            content: data,
          }
        }),
      )

      this.logger.debug(
        '✅ Files processed:',
        files.map((f) => ({
          name: f.name,
          size: `${(f.content.length / 1024).toFixed(2)} KB`,
        })),
      )

      return files as FileNode[]
    } catch (e) {
      this.logger.error('❌ Failed to read files:', e)
      throw e
    }
  }

  async readDir(): Promise<{ files: FileNode[]; selectedPath: string | null }> {
    try {
      this.logger.debug('📂 Starting readDirs')

      const selected = await open({
        directory: true,
        multiple: false,
      })

      if (!selected)
        return {
          files: [],
          selectedPath: selected,
        }
      const result = {
        files: await readDirRecursive(selected),
        selectedPath: selected,
      }
      return result
    } catch (e) {
      this.logger.error('❌ Desktop: Failed to read directories:', e)
      throw e
    }
  }

  async saveFilesToDirectory(
    files: { name: string; content: Uint8Array }[],
    options?: { suggestedName?: string },
  ): Promise<void> {
    try {
      const dirPath = await open({
        directory: true,
        defaultPath: options?.suggestedName,
      })

      if (!dirPath) return

      for (const file of files) {
        const filePath = await join(dirPath as string, file.name)
        await create(await dirname(filePath))
        await writeFile(filePath, file.content)
      }

      this.logger.debug('✅ Files saved successfully')
    } catch (e) {
      this.logger.error('❌ Failed to save files to directory:', e)
      throw e
    }
  }
}
