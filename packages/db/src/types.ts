export interface MenuItem {
  id: string
  name: string
  parentId: string | null
}

export interface MarkdownDB {
  create: () => void
  addMenuItem: (
    dir: string,
    parentId: string | null,
  ) => Promise<IDBValidKey | void>
  loadMenuTree(parentId?: null): Promise<MenuItem[]>
  updateMenuItem(id: string, updates: MenuItem): Promise<void>
  deleteMenuItem(id: MenuItem['id']): Promise<void>
}
