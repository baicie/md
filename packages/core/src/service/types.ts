export type StorageType = 'local' | 'server'

export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  data?: any
  params?: Record<string, any>
}

export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
}
