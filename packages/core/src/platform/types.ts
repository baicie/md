/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PlatformCapabilities {
  storage: StorageCapability
  theme: ThemeCapability
  fs: FileSystemCapability
  window?: WindowCapability
  dialog?: DialogCapability
  clipboard: ClipboardCapability
  network: NetworkCapability
  notification?: NotificationCapability
  updater?: UpdaterCapability
  system: SystemCapability
  logger: LoggerCapability
  toast: ToastCapability
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
  path: string
}

export interface DirectoryTypeNode {
  name: string
  type: 'directory'
  children: FileNode[]
  path: string
}

export interface FileSystemCapability {
  readFile(path: string): Promise<Uint8Array>
  writeFile(path: string, data: Uint8Array): Promise<void>
  exists(path: string): Promise<boolean>
  readDir: ReadDirFunc
  createDir(path: string): Promise<void>
}

export interface ReadDirResult {
  tree: FileNode[]
  fileMap: Map<string, File>
  selectedPath: string | null
}

type ReadDirFunc = (path?: string) => Promise<ReadDirResult>

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

/**
 * 提示类型
 */
export type ToastType = 'info' | 'success' | 'warning' | 'error'

/**
 * 提示选项
 */
export interface ToastOptions {
  /** 提示类型 */
  type?: ToastType
  /** 提示标题 */
  title?: string
  /** 提示内容 */
  message: string
  /** 持续时间（毫秒） */
  duration?: number
  /** 是否可关闭 */
  closeable?: boolean
  /** 关闭回调 */
  onClose?: () => void
  /** 点击回调 */
  onClick?: () => void
  /** 位置 */
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center'
}

/**
 * 提示能力接口
 */
export interface ToastCapability {
  /** 显示提示 */
  show(options: ToastOptions): void
  /** 显示成功提示 */
  success(
    message: string,
    options?: Omit<ToastOptions, 'type' | 'message'>,
  ): void
  /** 显示错误提示 */
  error(message: string, options?: Omit<ToastOptions, 'type' | 'message'>): void
  /** 显示警告提示 */
  warning(
    message: string,
    options?: Omit<ToastOptions, 'type' | 'message'>,
  ): void
  /** 显示信息提示 */
  info(message: string, options?: Omit<ToastOptions, 'type' | 'message'>): void
  /** 清除所有提示 */
  clear(): void
}
