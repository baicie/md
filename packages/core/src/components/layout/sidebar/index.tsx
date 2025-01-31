import { SidebarContextMenu } from './context-menu'
import { SidebarFileTree } from './file-tree'

import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu'

export const Sidebar = () => {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="h-full flex flex-col">
        <SidebarFileTree />
      </ContextMenuTrigger>

      <SidebarContextMenu />
    </ContextMenu>
  )
}
