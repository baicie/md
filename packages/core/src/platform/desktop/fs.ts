import { dirname, join, resolve } from '@tauri-apps/api/path'
import { open } from '@tauri-apps/plugin-dialog'
import {
  create,
  exists,
  readDir,
  readFile,
  writeFile,
} from '@tauri-apps/plugin-fs'

import type {
  DirectoryTypeNode,
  FileNode,
  FileSystemCapability,
  FileTypeNode,
  LoggerCapability,
  ReadDirResult,
} from '../types'

// export async function readDirRecursive(basePath: string): Promise<FileNode[]> {
//   const result: FileNode[] = []

//   const entries = await readDir(basePath)

//   for (const entry of entries) {
//     if (entry.name.startsWith('.')) {
//       continue
//     }
//     const fullPath = await resolve(basePath, entry.name)
//     if (entry.isDirectory) {
//       result.push({
//         name: entry.name,
//         type: 'directory',
//         children: await readDirRecursive(fullPath),
//         path: fullPath,
//       })
//     } else if (entry.isFile) {
//       const content = await readFile(fullPath)
//       result.push({
//         name: entry.name,
//         type: 'file',
//         path: fullPath,
//         content,
//         raw: new File([content], entry.name),
//       })
//     }
//   }

//   return result
// }
export class DesktopFileSystem implements FileSystemCapability {
  constructor(private readonly logger: LoggerCapability) {}

  async readFile(filePath: string): Promise<Uint8Array> {
    try {
      const content = await readFile(filePath)
      return content
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

  async createDir(dirPath: string): Promise<void> {
    try {
      await create(dirPath)
    } catch (e) {
      this.logger.error('Failed to create directory:', e)
      throw e
    }
  }

  async readDir(path?: string): Promise<ReadDirResult> {
    try {
      this.logger.debug('📂 Starting readDirs')
      if (!path) {
        path =
          (await open({
            directory: true,
          })) || ''
      }

      const { tree, fileMap } = await this.buildFileTree(path)
      const result = {
        tree,
        fileMap,
        selectedPath: path,
      }
      this.logger.debug('📂 readDir result', result)
      return result
    } catch (e) {
      this.logger.error('❌ Desktop: Failed to read directories:', e)
      throw e
    }
  }

  private async buildFileTree(
    basePath?: string,
  ): Promise<Omit<ReadDirResult, 'selectedPath'>> {
    const result: FileNode[] = []
    const dirMap = new Map<string, DirectoryTypeNode>()
    basePath = basePath || ''
    const entries = await readDir(basePath)

    for (const entry of entries) {
      if (entry.name.startsWith('.')) {
        continue
      }
      const fullPath = await resolve(basePath, entry.name)
      if (entry.isDirectory) {
        const { tree } = await this.buildFileTree(fullPath)
        const dirNode: DirectoryTypeNode = {
          name: entry.name,
          type: 'directory',
          children: tree,
          path: fullPath,
        }
        dirMap.set(fullPath, dirNode)
        result.push(dirNode)
      } else if (entry.isFile) {
        const fileNode: FileTypeNode = {
          name: entry.name,
          type: 'file',
          path: fullPath,
        }
        result.push(fileNode)
      }
    }
    return {
      tree: result,
      fileMap: new Map(),
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
