export interface MarkdownDB {
  create: () => void
  createDir: (dir: string) => Promise<void>
  createFile: (dir: string, content: string) => Promise<void>
}
