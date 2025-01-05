import localforage from 'localforage'
import { autorun } from 'mobx'

interface PersistentStoreOptions {
  key: string
  version?: number
  exclude?: string[]
  include?: string[]
  storage?: LocalForage
  onLoad?: (data: any) => void
  onSave?: (data: any) => any
}

export function persistentStore(options: PersistentStoreOptions) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      private static storage =
        options.storage ||
        localforage.createInstance({
          name: 'mdEditor',
          storeName: 'stores',
        })

      private static version = options.version || 1

      constructor(...args: any[]) {
        super(...args)
        this.loadPersistedData()
        this.setupPersistence()
      }

      private async loadPersistedData() {
        try {
          const storedData = await (this.constructor as any).storage.getItem(
            options.key,
          )

          // 检查版本并加载数据
          if (
            storedData &&
            storedData.version === (this.constructor as any).version
          ) {
            const filteredData = this.filterData(storedData.data)
            Object.assign(this, filteredData)
            options.onLoad?.(filteredData)
          } else if (
            storedData &&
            storedData.version < (this.constructor as any).version
          ) {
            // 处理版本升级
            console.warn(
              `Data version mismatch: stored ${storedData.version}, current ${(this.constructor as any).version}`,
            )
            // 这里可以添加数据迁移逻辑
          }
        } catch (error) {
          console.error(
            `Failed to load persisted data for ${options.key}:`,
            error,
          )
        }
      }

      private setupPersistence() {
        autorun(() => {
          const persistData = this.filterData(this)
          const dataToSave = options.onSave?.(persistData) || persistData

          ;(this.constructor as any).storage
            .setItem(options.key, {
              version: (this.constructor as any).version, // 保存当前版本号
              data: dataToSave,
            })
            .catch((error: Error) => {
              console.error(`Failed to persist data for ${options.key}:`, error)
            })
        })
      }

      private filterData(data: any) {
        return Object.keys(data).reduce(
          (acc, key) => {
            if (
              !key.startsWith('_') &&
              typeof data[key] !== 'function' &&
              (!options.exclude || !options.exclude.includes(key)) &&
              (!options.include || options.include.includes(key))
            ) {
              acc[key] = data[key]
            }
            return acc
          },
          {} as Record<string, any>,
        )
      }
    }
  }
}
