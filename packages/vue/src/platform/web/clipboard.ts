import type { ClipboardCapability } from '../types'

export class WebClipboard implements ClipboardCapability {
  async readText() {
    return navigator.clipboard.readText()
  }

  async writeText(text: string) {
    await navigator.clipboard.writeText(text)
  }

  async readFiles() {
    const items = await navigator.clipboard.read()
    const files: File[] = []
    for (const item of items) {
      for (const type of item.types) {
        if (type.startsWith('image/')) {
          const blob = await item.getType(type)
          files.push(new File([blob], 'clipboard-image', { type }))
        }
      }
    }
    return files
  }
}
