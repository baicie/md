import {
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
} from '@/components/ui/context-menu'
import { Icon } from '@/components/ui/icon'

export const SidebarContextMenu = () => {
  return (
    <ContextMenuContent className="w-64">
      <ContextMenuItem inset>
        Back
        <ContextMenuShortcut>⌘[</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem inset disabled>
        Forward
        <ContextMenuShortcut>⌘]</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem inset>
        Reload
        <ContextMenuShortcut>⌘R</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuSub>
        <ContextMenuSubTrigger inset>More Tools</ContextMenuSubTrigger>
        <ContextMenuSubContent className="w-48">
          <ContextMenuItem>
            Save Page As...
            <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>Create Shortcut...</ContextMenuItem>
          <ContextMenuItem>Name Window...</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Developer Tools</ContextMenuItem>
        </ContextMenuSubContent>
      </ContextMenuSub>
      <ContextMenuSeparator />
      <ContextMenuCheckboxItem checked>
        Show Bookmarks Bar
        <ContextMenuShortcut>⌘⇧B</ContextMenuShortcut>
      </ContextMenuCheckboxItem>
      <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
      <ContextMenuSeparator />
      <ContextMenuRadioGroup value="pedro">
        <ContextMenuLabel inset>People</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuRadioItem value="pedro">Pedro Duarte</ContextMenuRadioItem>
        <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
      </ContextMenuRadioGroup>
    </ContextMenuContent>
  )
}

// 1. 空白区域菜单
export const EmptyAreaContextMenu = () => {
  return (
    <ContextMenuContent className="w-48 dark:bg-neutral-800 dark:text-white">
      <ContextMenuItem>
        <Icon name="FolderPlus" className="mr-2 size-4" />
        新建文件夹
      </ContextMenuItem>
      <ContextMenuItem>
        <Icon name="FileText" className="mr-2 size-4" />
        新建文档
      </ContextMenuItem>
    </ContextMenuContent>
  )
}

// 2. 文件夹菜单
export const FolderContextMenu = () => {
  return (
    <ContextMenuContent className="w-48 dark:bg-neutral-800 dark:text-white">
      <ContextMenuItem>
        <Icon name="FileText" className="mr-2 size-4" />
        新建文档
      </ContextMenuItem>
      <ContextMenuItem>
        <Icon name="FolderPlus" className="mr-2 size-4" />
        新建文件夹
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem>
        <Icon name="Pencil" className="mr-2 size-4" />
        重命名
      </ContextMenuItem>
      <ContextMenuItem className="text-red-600 dark:text-red-400">
        <Icon name="Trash" className="mr-2 size-4" />
        删除
      </ContextMenuItem>
    </ContextMenuContent>
  )
}

// 3. Markdown 文件菜单
export const FileContextMenu = () => {
  return (
    <ContextMenuContent className="w-48 dark:bg-neutral-800 dark:text-white">
      <ContextMenuItem>
        <Icon name="Pencil" className="mr-2 size-4" />
        重命名
      </ContextMenuItem>
      <ContextMenuItem>
        <Icon name="Copy" className="mr-2 size-4" />
        复制
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem className="text-red-600 dark:text-red-400">
        <Icon name="Trash" className="mr-2 size-4" />
        删除
      </ContextMenuItem>
    </ContextMenuContent>
  )
}
