import { MENU_NAME } from './constant'
import { MarkdownDB } from './types'
import { openDB } from 'idb'
import type { IDBPDatabase } from 'idb'

export class IndexDB implements MarkdownDB {
  menuDB: IDBPDatabase<unknown>

  constructor() {}
  async create() {
    this.menuDB = await openDB(MENU_NAME)
  }
  async createDir(dir: string) {}
  createFile: (dir: string, content: string) => Promise<void>
}
