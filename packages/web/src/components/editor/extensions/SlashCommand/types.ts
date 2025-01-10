import type { Editor } from '@tiptap/core'
import type { icons } from 'lucide-react'

export interface Group {
  name: string
  title: string
  commands: Command[]
}

export interface Command {
  name: string
  label: string
  description: string
  aliases?: string[]
  iconName: keyof typeof icons
  action: (editor: Editor) => void
  shouldBeHidden?: (editor: Editor) => boolean
  isActive?: (editor: Editor) => boolean
}

export interface MenuListProps {
  editor: Editor
  items: Group[]
  command: (command: Command) => void
}
