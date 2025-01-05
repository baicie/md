import localforage from 'localforage'
import { autorun } from 'mobx'

interface PersistentPropertyOptions {
  key?: string
  storage?: LocalForage
  onLoad?: (value: any) => any
  onSave?: (value: any) => any
}

// 属性装饰器
export function persistent(options: PersistentPropertyOptions = {}) {
  return function (target: any, propertyKey: string) {
    // 确保类上有存储实例
    const storage =
      options.storage ||
      localforage.createInstance({
        name: 'mdEditor',
        storeName: 'properties',
      })

    // 生成存储键
    const storageKey =
      options.key || `${target.constructor.name}:${propertyKey}`

    // 保存原始值
    let value = target[propertyKey]

    // 在类初始化后加载数据
    const originalConstructor = target.constructor
    target.constructor = function (...args: any[]) {
      const instance = new originalConstructor(...args)

      // 加载持久化数据
      storage.getItem(storageKey).then((savedValue) => {
        if (savedValue !== null) {
          const processedValue = options.onLoad?.(savedValue) || savedValue
          instance[propertyKey] = processedValue
        }
      })

      // 设置自动保存
      autorun(() => {
        const currentValue = instance[propertyKey]
        const valueToSave = options.onSave?.(currentValue) || currentValue
        storage.setItem(storageKey, valueToSave)
      })

      return instance
    }

    // 定义属性访问器
    Object.defineProperty(target, propertyKey, {
      get() {
        return value
      },
      set(newValue) {
        value = newValue
      },
      enumerable: true,
      configurable: true,
    })
  }
}
