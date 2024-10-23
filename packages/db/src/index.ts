import { IndexDB } from './index-db'

export type MarkdownDBType = 'indexdb' | 'localstorage' | 'sqlite'
export class MarkDownDatabaseFactiry {
  static createConnection(type: MarkdownDBType = 'indexdb') {
    switch (type) {
      case 'indexdb':
      default:
        return new IndexDB()
    }
  }
}
