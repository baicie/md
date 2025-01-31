import { ChevronRight, File, Folder } from 'lucide-react'
import { useCallback, useState } from 'react'

import { useFiles } from '../file-context'

import type { FileNode, FileTypeNode } from '@/platform/types'

import { FileSelector } from '@/components/composite/file-select'
import { Ellipsis } from '@/components/ui/ellipsis'
import { Icon } from '@/components/ui/icon'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sidebar,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { usePlatform } from '@/hooks/use-platform'
import { cn } from '@/lib/utils'
import { useThemeStore } from '@/stores/theme'

const FileTreeNode = ({
  file,
  onFileClick,
  activeFile,
}: {
  file: FileNode
  onFileClick: (file: FileNode) => void
  activeFile?: FileTypeNode
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const isDirectory = file.type === 'directory'

  if (isDirectory) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton onClick={() => setIsOpen(!isOpen)} className="gap-1">
          <ChevronRight
            className={cn(
              'transition-transform shrink-0 size-4',
              isOpen && 'rotate-90',
            )}
          />
          <Folder className="shrink-0 size-4" />
          <Ellipsis className="text-left">{file.name}</Ellipsis>
        </SidebarMenuButton>

        {isOpen && file.children && (
          <SidebarMenuSub>
            {file.children.map((child) => (
              <FileTreeNode
                key={child.path}
                file={child as FileNode}
                onFileClick={onFileClick}
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
        onClick={() => onFileClick(file)}
        isActive={activeFile?.path === file.path}
        className="gap-1"
      >
        <File className="shrink-0 size-4" />
        <Ellipsis className="text-left">{file.name}</Ellipsis>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export const SidebarFileTree = () => {
  const { logger } = usePlatform()
  const { theme, toggleTheme } = useThemeStore()
  const {
    files,
    isLoading,
    activeFile,
    editor,
    handleFileSelect,
    setActiveFile,
    setError,
  } = useFiles()

  const handleFileClick = useCallback(
    async (file: FileNode) => {
      try {
        if (file.type === 'file' && file.raw) {
          setActiveFile(file)
          const content = await file.raw.text()
          editor?.commands.setContent(content)
        }
      } catch (error) {
        logger.error('Failed to load file', error)
        setError(error as Error)
      }
    },
    [editor?.commands, logger, setActiveFile, setError],
  )

  return (
    <SidebarProvider defaultOpen>
      <Sidebar variant="inset" className="flex-1">
        <SidebarHeader className="border-b border-neutral-200 dark:border-neutral-700 w-full">
          <div className="flex items-center justify-between">
            <span className="text-neutral-900 dark:text-white">
              文件 {__PLATFORM__}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
                aria-label="toggle theme"
              >
                <Icon
                  name={theme === 'dark' ? 'Sun' : 'Moon'}
                  className="size-4"
                />
              </button>
            </div>
          </div>
        </SidebarHeader>
        <ScrollArea>
          <FileSelector onSelect={handleFileSelect} />
          {isLoading ? (
            <div className="p-4">加载中...</div>
          ) : (
            files.length > 0 && (
              <SidebarGroup>
                <SidebarGroupLabel>已选择的文件</SidebarGroupLabel>
                <SidebarMenu>
                  {files.map((file) => (
                    <FileTreeNode
                      key={file.path}
                      file={file}
                      onFileClick={handleFileClick}
                      activeFile={activeFile}
                    />
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            )
          )}
        </ScrollArea>
      </Sidebar>
    </SidebarProvider>
  )
}
