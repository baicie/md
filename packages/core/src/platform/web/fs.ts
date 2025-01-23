import { directoryOpen, fileOpen, fileSave } from 'browser-fs-access'

import type { FileNode, FileSystemCapability, LoggerCapability } from '../types'

export class WebFileSystem implements FileSystemCapability {
  constructor(private readonly logger: LoggerCapability) {}

  async readFile(_path: string): Promise<Uint8Array> {
    try {
      const blob = await fileOpen({
        multiple: false,
      })
      return new Uint8Array(await blob.arrayBuffer())
    } catch (e) {
      this.logger.error('Failed to read file:', e)
      throw e
    }
  }

  async writeFile(path: string, data: Uint8Array): Promise<void> {
    try {
      const blob = new Blob([data])
      await fileSave(blob, {
        fileName: path,
      })
    } catch (e) {
      this.logger.error('Failed to write file:', e)
      throw e
    }
  }

  async exists(_path: string): Promise<boolean> {
    // browser-fs-access 不支持检查文件存在
    return false
  }

  async readDir(_path: string): Promise<string[]> {
    try {
      const blobs = await directoryOpen({
        recursive: false,
      })
      return blobs.map((blob) => blob.name)
    } catch (e) {
      this.logger.error('Failed to read directory:', e)
      throw e
    }
  }

  async createDir(_path: string): Promise<void> {
    // browser-fs-access 不支持创建目录
    throw new Error('Operation not supported in web environment')
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

      const blobs = await fileOpen({
        multiple: true,
        // 转换文件类型格式
        mimeTypes: options?.types?.flatMap((type) => Object.keys(type.accept)),
      })

      const files = await Promise.all(
        Array.from(blobs)
          .filter((blob): blob is File => blob instanceof File)
          .map(async (blob) => {
            const content = new Uint8Array(await blob.arrayBuffer())
            const paths = (blob.webkitRelativePath || blob.name).split('/')
            const fileName = paths[paths.length - 1]

            if (content.length === 0) {
              this.logger.warn('⚠️ File is empty:', fileName)
            }

            this.logger.debug(`📄 File loaded:`, {
              name: fileName,
              size: `${(content.length / 1024).toFixed(2)} KB`,
            })

            return {
              name: fileName,
              type: 'file' as const,
              path: blob.webkitRelativePath || blob.name,
              content,
              raw: blob,
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

      return files
    } catch (e) {
      this.logger.error('❌ Failed to read files:', e)
      throw e
    }
  }

  async readDirRecursive(): Promise<FileNode[]> {
    try {
      const handles = await directoryOpen({
        recursive: true,
        startIn: 'documents',
      })

      const result: FileNode[] = []
      const dirMap = new Map<string, FileNode[]>()

      // 首先创建所有目录节点
      for (const handle of handles) {
        const paths = handle.name.split('/')
        let currentPath = ''

        // 为每一级目录创建节点
        for (let i = 0; i < paths.length - 1; i++) {
          const parentPath = currentPath
          currentPath = currentPath ? `${currentPath}/${paths[i]}` : paths[i]

          if (!dirMap.has(currentPath)) {
            const dirNode: FileNode = {
              name: paths[i],
              type: 'directory',
              path: currentPath,
              children: [],
            }
            dirMap.set(currentPath, dirNode.children as FileNode[])

            if (parentPath) {
              dirMap.get(parentPath)?.push(dirNode)
            } else {
              result.push(dirNode)
            }
          }
        }
      }

      // 然后添加文件节点
      for (const blob of handles) {
        if (blob instanceof File) {
          const content = new Uint8Array(await blob.arrayBuffer())
          const paths = (blob.webkitRelativePath || blob.name).split('/')
          const fileName = paths[paths.length - 1]
          const dirPath = paths.slice(0, -1).join('/')

          const fileNode: FileNode = {
            name: fileName,
            type: 'file',
            path: blob.webkitRelativePath || blob.name,
            content,
            raw: blob,
          }

          if (dirPath) {
            dirMap.get(dirPath)?.push(fileNode)
          } else {
            result.push(fileNode)
          }
        }
      }

      return result
    } catch (e) {
      this.logger.error('❌ Failed to read directory recursively:', e)
      throw e
    }
  }

  async readDirs(): Promise<FileNode[]> {
    try {
      this.logger.debug('📂 Starting readDirs')
      return await this.readDirRecursive()
    } catch (e) {
      this.logger.error('❌ Failed to read directories:', e)
      throw e
    }
  }

  async saveFilesToDirectory(
    files: { name: string; content: Uint8Array }[],
    _options?: { suggestedName?: string },
  ): Promise<void> {
    try {
      for (const file of files) {
        const blob = new Blob([file.content])
        await fileSave(blob, {
          fileName: file.name,
        })
      }
      this.logger.debug('✅ Files saved successfully')
    } catch (e) {
      this.logger.error('❌ Failed to save files:', e)
      throw e
    }
  }
}
