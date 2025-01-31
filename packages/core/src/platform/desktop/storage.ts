import { Store } from '@tauri-apps/plugin-store'

import type { LoggerCapability, StorageCapability } from '../types'

export class DesktopStorage implements StorageCapability {
  private store!: Store

  constructor(private readonly logger: LoggerCapability) {}

  private async ensureStoreInitialized() {
    if (!this.store) {
      this.store = await Store.load(__APP_NAME__)
    }
  }

  async get<T>(key: string) {
    try {
      await this.ensureStoreInitialized()
      const value = await this.store.get<T>(key)
      return value as T
    } catch (error) {
      this.logger.warn('Failed to get from storage:', error)
      return null
    }
  }

  async set<T>(key: string, value: T) {
    try {
      await this.ensureStoreInitialized()
      await this.store.set(key, value)
      await this.store.save()
    } catch (error) {
      this.logger.warn('Failed to save to storage:', error)
      throw error
    }
  }

  async remove(key: string) {
    try {
      await this.ensureStoreInitialized()
      await this.store.delete(key)
      await this.store.save()
    } catch (error) {
      this.logger.warn('Failed to remove from storage:', error)
      throw error
    }
  }

  async clear() {
    try {
      await this.ensureStoreInitialized()
      await this.store.clear()
      await this.store.save()
    } catch (error) {
      this.logger.warn('Failed to clear storage:', error)
      throw error
    }
  }
}
