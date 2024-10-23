import { MENU_NAME } from './constant'
import { MarkdownDB, MenuItem } from './types'
import { openDB } from 'idb'
import type { IDBPDatabase } from 'idb'

const storeName = 'menuItems'

export class IndexDB implements MarkdownDB {
  menuDB!: IDBPDatabase<unknown>

  constructor() {}

  async create() {
    this.menuDB = await openDB(MENU_NAME, 1, {
      upgrade(database) {
        if (!database.objectStoreNames.contains(storeName)) {
          const store = database.createObjectStore(storeName, {
            keyPath: 'id',
            autoIncrement: true,
          })
          store.createIndex('parentId', 'parentId', { unique: false })
        }
      },
    })
  }

  addMenuItem(name: string, parentId: string | null = null) {
    return this.menuDB.put(storeName, { name, parentId })
  }

  async loadMenuTree(parentId = null) {
    const items = await this.menuDB.getAllFromIndex(
      storeName,
      'parentId',
      parentId,
    )

    const tree: MenuItem[] = await Promise.all(
      items.map(async (item) => {
        const children = await this.loadMenuTree(item.id)
        return { ...item, children }
      }),
    )

    return tree
  }

  async updateMenuItem(id: MenuItem['id'], updates: MenuItem) {
    const item = await this.menuDB.get(storeName, id)
    if (item) {
      const updatedItem = { ...item, ...updates }
      await this.menuDB.put(storeName, updatedItem)
      console.log(`Menu item with ID ${id} updated.`)
    } else {
      console.log(`Menu item with ID ${id} not found.`)
    }
  }

  async deleteMenuItem(id: MenuItem['id']) {
    // 删除当前菜单项
    await this.menuDB.delete(storeName, id)
    console.log(`Menu item with ID ${id} deleted.`)

    // 删除子节点
    const children = await this.menuDB.getAllFromIndex(
      storeName,
      'parentId',
      id,
    )
    for (const child of children) {
      await this.deleteMenuItem(child.id)
    }
  }
}
