/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PlatformCapabilities {
  storage: StorageCapability
  theme: ThemeCapability
  fs?: FileSystemCapability
  window?: WindowCapability
  dialog?: DialogCapability
  clipboard: ClipboardCapability
  network: NetworkCapability
  notification?: NotificationCapability
  updater?: UpdaterCapability
  system: SystemCapability
  logger: LoggerCapability
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LoggerOptions {
  level?: LogLevel
  prefix?: string
  disabled?: boolean
}

export interface LoggerCapability {
  debug(message: string, ...args: any[]): void
  info(message: string, ...args: any[]): void
  warn(message: string, ...args: any[]): void
  error(message: string, ...args: any[]): void
}

export type Platform = 'desktop' | 'web'

export interface SystemCapability {
  platform: Platform
}

export interface UpdaterCapability {
  check(): Promise<boolean>
  download(): Promise<void>
  install(): Promise<void>
  getVersion(): string
}

export interface NotificationOptions {
  title: string
  body?: string
  icon?: string
}

export interface NotificationCapability {
  show(options: NotificationOptions): Promise<void>
  requestPermission(): Promise<'granted' | 'denied'>
}

export interface NetworkCapability {
  isOnline(): boolean
  subscribe(callback: (online: boolean) => void): () => void
}

export interface ClipboardCapability {
  readText(): Promise<string>
  writeText(text: string): Promise<void>
  readFiles(): Promise<File[]>
}

export interface DialogFilter {
  name: string
  extensions: string[]
}

export interface DialogCapability {
  open(options: {
    title?: string
    filters?: DialogFilter[]
    multiple?: boolean
  }): Promise<string[] | null>

  save(options: {
    title?: string
    defaultPath?: string
    filters?: DialogFilter[]
  }): Promise<string | null>
}

export interface WindowCapability {
  minimize(): void
  maximize(): void
  close(): void
  isMaximized(): boolean
  setTitle(title: string): void
}

export type FileNode = FileTypeNode | DirectoryTypeNode

export interface FileTypeNode {
  name: string
  type: 'file'
  content: Uint8Array
  path: string
  raw: File
}

export interface DirectoryTypeNode {
  name: string
  type: 'directory'
  children: FileNode[]
  path: string
}

export interface FileSystemCapability {
  readFile(path: string): Promise<Uint8Array>
  readFiles(options: {
    types?: {
      description?: string
      accept: Record<`${string}/${string}`, `.${string}`[]>
    }[]
  }): Promise<FileNode[]>
  writeFile(path: string, data: Uint8Array): Promise<void>
  exists(path: string): Promise<boolean>
  readDir(
    path?: string,
  ): Promise<{ files: FileNode[]; selectedPath: string | null }>
  createDir(path: string): Promise<void>
}

export interface FileStat {
  createdAt: number
  updatedAt: number
  isFile: boolean
  isDirectory: boolean
}
export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeCapability {
  current(): ThemeMode
  toggle(): void
  subscribe(callback: (theme: 'light' | 'dark') => void): () => void
}

export interface StorageCapability {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, value: T): Promise<void>
  remove(key: string): Promise<void>
  clear(): Promise<void>
}
