import { request } from '@/service'
import type { FileItem } from './types'

export const fileApi = {
  // 获取所有文件
  async getFiles() {
    return request.request<FileItem[]>({
      method: 'GET',
      path: '/files',
    })
  },

  // 获取单个文件
  async getFile(id: string) {
    return request.request<FileItem>({
      method: 'GET',
      path: '/files',
      params: { id },
    })
  },

  // 保存文件
  async saveFile(file: FileItem) {
    return request.request<FileItem>({
      method: 'POST',
      path: '/files',
      data: file,
    })
  },

  // 删除文件
  async deleteFile(id: string) {
    return request.request<void>({
      method: 'DELETE',
      path: '/files',
      params: { id },
    })
  },
}
