import localforage from 'localforage'

import type { LoggerCapability, StorageCapability } from '../types'

export class WebStorage implements StorageCapability {
  private store: LocalForage

  constructor(private readonly logger: LoggerCapability) {
    this.store = localforage.createInstance({
      name: __APP_NAME__,
      description: 'Storage for markdown editor',
    })
  }

  async get<T>(key: string) {
    try {
      const value = await this.store.getItem<T>(key)
      return value
    } catch (error) {
      this.logger.warn('Failed to get from storage:', error)
      return null
    }
  }

  async set<T>(key: string, value: T) {
    try {
      await this.store.setItem(key, value)
    } catch (error) {
      this.logger.warn('Failed to save to storage:', error)
      throw error
    }
  }

  async remove(key: string) {
    try {
      await this.store.removeItem(key)
    } catch (error) {
      this.logger.warn('Failed to remove from storage:', error)
      throw error
    }
  }

  async clear() {
    try {
      await this.store.clear()
    } catch (error) {
      this.logger.warn('Failed to clear storage:', error)
      throw error
    }
  }
}
