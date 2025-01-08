import type { EmojiItem } from '@baicie/md-extension-emoji'

export interface Command {
  name: string
}

export interface EmojiListProps {
  command: (command: Command) => void
  items: EmojiItem[]
}
