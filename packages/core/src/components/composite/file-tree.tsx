import { ChevronRight, File, Folder } from 'lucide-react'
import * as React from 'react'

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
} from '../ui/sidebar'

import { cn } from '@/lib/utils'

interface FileNode {
  id: string
  name: string
  type: 'file' | 'directory'
  children?: FileNode[]
  path: string
}

interface FileTreeProps {
  files: FileNode[]
  onFileSelect: (file: FileNode) => void
  activeFile?: string
}

export function FileTree({ files, onFileSelect, activeFile }: FileTreeProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>文件</SidebarGroupLabel>
      <SidebarMenu>
        {files.map((file) => (
          <FileTreeNode
            key={file.id}
            file={file}
            onFileSelect={onFileSelect}
            activeFile={activeFile}
          />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function FileTreeNode({
  file,
  onFileSelect,
  activeFile,
}: {
  file: FileNode
  onFileSelect: (file: FileNode) => void
  activeFile?: string
}) {
  const [isOpen, setIsOpen] = React.useState(false)
  const isDirectory = file.type === 'directory'

  if (isDirectory) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton onClick={() => setIsOpen(!isOpen)} className="gap-2">
          <ChevronRight
            className={cn('transition-transform', isOpen && 'rotate-90')}
          />
          <Folder className="size-4" />
          <span>{file.name}</span>
        </SidebarMenuButton>

        {isOpen && file.children && (
          <SidebarMenuSub>
            {file.children.map((child) => (
              <FileTreeNode
                key={child.id}
                file={child}
                onFileSelect={onFileSelect}
                activeFile={activeFile}
              />
            ))}
          </SidebarMenuSub>
        )}
      </SidebarMenuItem>
    )
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => onFileSelect(file)}
        isActive={activeFile === file.path}
        className="gap-2"
      >
        <File className="size-4" />
        <span>{file.name}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
