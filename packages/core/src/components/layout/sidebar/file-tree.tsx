import { ChevronRight, File, Folder } from 'lucide-react'
import { useCallback, useState } from 'react'

import { useFiles } from '../file-context'
import { useFileStorageStrategy } from '../file-strategy'
import {
  EmptyAreaContextMenu,
  FileContextMenu,
  FolderContextMenu,
} from './context-menu'

import type { FileNode, FileTypeNode } from '@/platform/types'

import { Button } from '@/components/ui/button'
import { ContextMenu, ContextMenuTrigger } from '@/components/ui/context-menu'
import { Ellipsis } from '@/components/ui/ellipsis'
import { Icon } from '@/components/ui/icon'
import { Sidebar, SidebarProvider } from '@/components/ui/sidebar'
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
      <ContextMenu>
        <ContextMenuTrigger>
          <div>
            <Button onClick={() => setIsOpen(!isOpen)} className="gap-1">
              <ChevronRight
                className={cn(
                  'transition-transform shrink-0 size-4',
                  isOpen && 'rotate-90',
                )}
              />
              <Folder className="shrink-0 size-4" />
              <Ellipsis className="text-left">{file.name}</Ellipsis>
            </Button>

            {isOpen && file.children && (
              <div>
                {file.children.map((child) => (
                  <FileTreeNode
                    key={child.path}
                    file={child as FileNode}
                    onFileClick={onFileClick}
                    activeFile={activeFile}
                  />
                ))}
              </div>
            )}
          </div>

          <FolderContextMenu />
        </ContextMenuTrigger>
      </ContextMenu>
    )
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div>
          <Button
            onClick={() => onFileClick(file)}
            // isActive={activeFile?.path === file.path}
            className="gap-1"
          >
            <File className="shrink-0 size-4" />
            <Ellipsis className="text-left">{file.name}</Ellipsis>
          </Button>
        </div>

        <FileContextMenu />
      </ContextMenuTrigger>
    </ContextMenu>
  )
}

export const SidebarFileTree = () => {
  const { logger } = usePlatform()
  const { theme, toggleTheme } = useThemeStore()
  const strategy = useFileStorageStrategy()
  const {
    files,
    activeFile,
    editor,
    // handleFileSelect,
    setActiveFile,
    setError,
  } = useFiles()

  const handleFileClick = useCallback(
    async (file: FileNode) => {
      try {
        if (file.type === 'file') {
          const rawFile = await strategy.loadFile(file.path)
          if (rawFile) {
            setActiveFile(file)
            const content = await rawFile.text()
            editor?.commands.blur()
            editor?.commands.setContent(content)
          }
        }
      } catch (error) {
        logger.error('Failed to load file', error)
        setError(error as Error)
      }
    },
    [editor?.commands, logger, setActiveFile, setError, strategy],
  )

  return (
    <SidebarProvider>
      <Sidebar className="flex-1">
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
        {/* <FileSelector onSelect={handleFileSelect} /> */}
        <ContextMenu>
          <ContextMenuTrigger>
            {files.map((file) => (
              <FileTreeNode
                key={file.path}
                file={file}
                onFileClick={handleFileClick}
                activeFile={activeFile}
              />
            ))}

            <EmptyAreaContextMenu />
          </ContextMenuTrigger>
        </ContextMenu>
      </Sidebar>
    </SidebarProvider>
  )
}
