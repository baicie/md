export interface FileItem {
  id: string
  name: string
  type: FileType
  path: string
}

export type FileType = 'folder' | 'markdown' | 'other'
