import type { FileSystemCapability, LoggerCapability } from '../types'

export class WebFileSystem implements FileSystemCapability {
  constructor(private readonly logger: LoggerCapability) {}

  private async getFileHandle(
    options?: {
      multiple?: boolean
    } & OpenFilePickerOptions,
  ): Promise<FileSystemFileHandle[]> {
    try {
      return await window.showOpenFilePicker(options)
    } catch (e) {
      this.logger.error('Failed to get file handle:', e)
      throw e
    }
  }

  async readFile(_path: string): Promise<Uint8Array> {
    try {
      const [handle] = await this.getFileHandle()
      const file = await handle.getFile()
      const arrayBuffer = await file.arrayBuffer()
      return new Uint8Array(arrayBuffer)
    } catch (e) {
      this.logger.error('Failed to read file:', e)
      throw e
    }
  }

  async writeFile(path: string, data: Uint8Array): Promise<void> {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: path,
      })
      const writable = await handle.createWritable()
      await writable.write(data)
      await writable.close()
    } catch (e) {
      this.logger.error('Failed to write file:', e)
      throw e
    }
  }

  async exists(path: string): Promise<boolean> {
    try {
      const dirHandle = await window.showDirectoryPicker()
      await dirHandle.getFileHandle(path)
      return true
    } catch {
      return false
    }
  }

  async readDir(_path: string): Promise<string[]> {
    try {
      const dirHandle = await window.showDirectoryPicker()
      const files: string[] = []
      for await (const entry of dirHandle.values()) {
        files.push(entry.name)
      }
      return files
    } catch (e) {
      this.logger.error('Failed to read directory:', e)
      throw e
    }
  }

  async createDir(path: string): Promise<void> {
    try {
      const dirHandle = await window.showDirectoryPicker()
      await dirHandle.getDirectoryHandle(path, { create: true })
    } catch (e) {
      this.logger.error('Failed to create directory:', e)
      throw e
    }
  }

  // 实用方法：读取多个文件
  async readFiles(options?: {
    types?: {
      description?: string
      accept: Record<`${string}/${string}`, `.${string}`[]>
    }[]
  }): Promise<{ name: string; content: Uint8Array }[]> {
    try {
      this.logger.debug('📂 Starting readFiles', {
        description: options?.types?.[0]?.description,
        accept: options?.types?.[0]?.accept,
      })

      const handles = await this.getFileHandle({
        multiple: true,
        types: options?.types,
      })

      this.logger.debug(`📑 Got ${handles.length} file handles`)

      const files = await Promise.all(
        handles.map(async (handle) => {
          const file = await handle.getFile()
          if (file.size === 0) {
            this.logger.warn('⚠️ File is empty:', file.name)
          }

          const arrayBuffer = await file.arrayBuffer()
          if (arrayBuffer.byteLength === 0) {
            this.logger.warn('⚠️ ArrayBuffer is empty for file:', file.name)
          }

          const content = new Uint8Array(arrayBuffer)
          this.logger.debug(`📄 File loaded:`, {
            name: file.name,
            bufferSize: `${(arrayBuffer.byteLength / 1024).toFixed(2)} KB`,
            contentSize: `${(content.length / 1024).toFixed(2)} KB`,
          })

          return {
            name: file.name,
            content,
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

  async readDirRecursive(
    basePath = '',
    subDirHandle?: FileSystemDirectoryHandle,
  ): Promise<{ name: string; content: Uint8Array }[]> {
    const files: { name: string; content: Uint8Array }[] = []
    const dirHandle = subDirHandle ?? (await window.showDirectoryPicker())
    try {
      for await (const entry of dirHandle.values()) {
        const path = basePath ? `${basePath}/${entry.name}` : entry.name

        if (entry.kind === 'file') {
          try {
            const file = await entry.getFile()
            const arrayBuffer = await file.arrayBuffer()
            files.push({
              name: path,
              content: new Uint8Array(arrayBuffer),
            })
          } catch (e) {
            this.logger.error(`Failed to read file ${path}:`, e)
            // 继续处理其他文件
            continue
          }
        } else if (entry.kind === 'directory') {
          try {
            const subDirHandle = await dirHandle.getDirectoryHandle(entry.name)
            const subFiles = await this.readDirRecursive(path, subDirHandle)
            files.push(...subFiles)
          } catch (e) {
            this.logger.error(`Failed to read directory ${path}:`, e)
            // 继续处理其他目录
            continue
          }
        }
      }

      this.logger.debug('📂 Directory read complete:', {
        fileCount: files.length,
        files: files.map((f) => ({
          name: f.name,
          size: `${(f.content.length / 1024).toFixed(2)} KB`,
        })),
      })

      return files
    } catch (e) {
      this.logger.error('❌ Failed to read directory recursively:', e)
      throw e
    }
  }

  // 读取多个文件夹
  async readDirs(options?: {
    types?: {
      description?: string
      accept: Record<string, string[]>
    }[]
  }): Promise<{ name: string; content: Uint8Array }[]> {
    try {
      this.logger.debug('📂 Starting readDirs', {
        description: options?.types?.[0]?.description,
        accept: options?.types?.[0]?.accept,
      })

      const dirHandle = await window.showDirectoryPicker({
        mode: 'read',
      })
      return await this.readDirRecursive('', dirHandle)
    } catch (e) {
      this.logger.error('❌ Failed to read directories:', e)
      throw e
    }
  }

  // 保存文件到指定文件夹
  async saveFilesToDirectory(
    files: { name: string; content: Uint8Array }[],
    _options?: {
      suggestedName?: string
    },
  ): Promise<void> {
    try {
      const dirHandle = await window.showDirectoryPicker({
        mode: 'readwrite',
        startIn: 'downloads',
      })

      for (const file of files) {
        const subDirs = file.name.split('/')
        const fileName = subDirs.pop()
        if (!fileName) {
          this.logger.error('Invalid file name:', file.name)
          continue
        }

        let currentHandle = dirHandle
        // 创建子文件夹
        for (const dir of subDirs) {
          try {
            currentHandle = await currentHandle.getDirectoryHandle(dir, {
              create: true,
            })
          } catch (e) {
            this.logger.error(`Failed to create directory ${dir}:`, e)
            throw e
          }
        }

        await this.saveFileToDirectory(currentHandle, fileName, file.content)
      }

      this.logger.debug('✅ Files saved successfully')
    } catch (e) {
      this.logger.error('❌ Failed to save files to directory:', e)
      throw e
    }
  }

  private async saveFileToDirectory(
    dirHandle: FileSystemDirectoryHandle,
    fileName: string,
    content: Uint8Array,
  ): Promise<void> {
    try {
      const fileHandle = await dirHandle.getFileHandle(fileName, {
        create: true,
      })
      const writable = await fileHandle.createWritable()
      await writable.write(content)
      await writable.close()
    } catch (e) {
      this.logger.error(`❌ Failed to save file ${fileName}:`, e)
      throw e
    }
  }
}
