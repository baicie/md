import type { StorageCapability } from '../types'

export class WebStorage implements StorageCapability {
  async get<T>(key: string) {
    const value = localStorage.getItem(key)
    return (value ? JSON.parse(value) : null) as T
  }

  async set<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  async remove(key: string) {
    localStorage.removeItem(key)
  }

  async clear() {
    localStorage.clear()
  }
}
