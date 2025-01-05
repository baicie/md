import axios from 'axios'
import localforage from 'localforage'
import { container } from 'tsyringe'
import { Config } from '@/store/config'
import type { ApiResponse, RequestConfig } from './types'

class Request {
  private static instance: Request
  private configStore: Config

  private constructor() {
    this.configStore = container.resolve(Config)
  }

  static getInstance() {
    if (!Request.instance) {
      Request.instance = new Request()
    }
    return Request.instance
  }

  // 统一请求方法
  async request<T = any>(config: RequestConfig): Promise<ApiResponse<T>> {
    // 直接从 store 获取当前配置
    const { storageType, apiUrl, token } = this.configStore.currentConfig

    // 根据存储类型选择处理方式
    if (storageType === 'local') {
      return this.handleLocalRequest<T>(config)
    } else {
      return this.handleServerRequest<T>({
        ...config,
        baseURL: apiUrl,
        token,
      })
    }
  }

  // 处理本地存储请求
  private async handleLocalRequest<T>(
    config: RequestConfig,
  ): Promise<ApiResponse<T>> {
    const storage = localforage.createInstance({
      name: 'mdEditor',
      storeName: config.path.split('/')[0], // 使用路径第一段作为存储名
    })

    try {
      switch (config.method) {
        case 'GET': {
          if (config.params?.id) {
            const item = await storage.getItem(config.params.id)
            return { code: 200, data: item as T, message: 'success' }
          } else {
            const items: T[] = []
            await storage.iterate((value) => {
              items.push(value as T)
            })
            return { code: 200, data: items as T, message: 'success' }
          }
        }
        case 'POST':
        case 'PUT': {
          await storage.setItem(config.data.id, config.data)
          return { code: 200, data: config.data as T, message: 'success' }
        }
        case 'DELETE': {
          if (config.params?.id) {
            await storage.removeItem(config.params.id)
          } else {
            await storage.clear()
          }
          return { code: 200, data: null as T, message: 'success' }
        }
        default:
          throw new Error(`Unsupported method: ${config.method}`)
      }
    } catch (error) {
      return {
        code: 500,
        data: null as T,
        message: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  // 处理服务器请求
  private async handleServerRequest<T>({
    method,
    path,
    data,
    params,
    baseURL,
    token,
  }: RequestConfig & { baseURL: string; token: string }): Promise<
    ApiResponse<T>
  > {
    try {
      const { data: responseData } = await axios({
        method,
        url: path,
        data,
        params,
        baseURL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return responseData
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          code: error.response?.status || 500,
          data: null as T,
          message: error.message,
        }
      }
      return {
        code: 500,
        data: null as T,
        message: 'Unknown error',
      }
    }
  }
}

export const request = Request.getInstance()
