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

  // 实用方法：保存文件到指定目录
  async saveFileToDirectory(
    dirHandle: FileSystemDirectoryHandle,
    fileName: string,
    data: Uint8Array,
  ): Promise<void> {
    try {
      const fileHandle = await dirHandle.getFileHandle(fileName, {
        create: true,
      })
      const writable = await fileHandle.createWritable()
      await writable.write(data)
      await writable.close()
    } catch (e) {
      this.logger.error('Failed to save file to directory:', e)
      throw e
    }
  }
}
