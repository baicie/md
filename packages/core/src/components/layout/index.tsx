import { ChevronRight, File, Folder } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import { FileSelector } from '../composite/file-select'
import { Ellipsis } from '../ui/ellipsis'
import { ScrollArea } from '../ui/scroll-area'

import type { FileNode } from '@/platform/types'
import type { Editor } from '@tiptap/core'

import { Icon } from '@/components/ui/icon'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
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
import { storageKeys } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useThemeStore } from '@/stores/theme'

// 文件树节点组件
const FileTreeNode = ({
  file,
  onFileClick,
  activeFile,
}: {
  file: FileNode
  onFileClick: (file: FileNode) => void
  activeFile?: string
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
        isActive={activeFile === file.path}
        className="gap-1"
      >
        <File className="shrink-0 size-4" />
        <Ellipsis className="text-left">{file.name}</Ellipsis>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export const Layout = ({
  children,
  editor,
}: {
  children: React.ReactNode
  editor: Editor | null
}) => {
  const { theme, toggleTheme } = useThemeStore()
  const [files, setFiles] = useState<FileNode[]>([])
  const [activeFile, setActiveFile] = useState<string>()
  const [_, setIsLoading] = useState(false)
  const [_siderLoading, setSiderLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)
  const [width, setWidth] = useState(20)
  const { logger, storage } = usePlatform()

  const handleFileSelect = (selectedFiles: FileNode[]) => {
    setFiles(selectedFiles)
    storage
      .set(storageKeys.files, selectedFiles)
      .then(() => {
        logger.debug('storege success')
      })
      .catch((e) => {
        logger.error('storege error', e)
      })
  }

  const handleFileClick = useCallback(
    async (file: FileNode) => {
      try {
        setIsLoading(true)
        if (file.type === 'file' && file.raw) {
          setActiveFile(file.path)
          const content = await file.raw.text()
          editor?.commands.setContent(content)
        }
      } catch (error) {
        logger.error('Failed to load file', error)
        setError(error as Error)
      } finally {
        setIsLoading(false)
      }
    },
    [editor, logger],
  )

  useEffect(() => {
    logger.debug('storage', storage)
    setSiderLoading(true)
    storage
      .get<FileNode[]>(storageKeys.files)
      .then((files) => {
        if (files) {
          setFiles(files)
        }
      })
      .finally(() => {
        setSiderLoading(false)
      })
  }, [logger, storage])

  return (
    <div className="h-screen w-full flex flex-col bg-white dark:bg-neutral-900">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={width}
          minSize={15}
          maxSize={30}
          onResize={setWidth}
        >
          <div className="h-full flex flex-col">
            <SidebarProvider defaultOpen>
              <Sidebar variant="inset" className="flex-1">
                <SidebarHeader className="border-b border-neutral-200 dark:border-neutral-700 w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-900 dark:text-white">
                      文件 {__PLATFORM__}
                    </span>
                    <div className="flex items-center gap-2">
                      {/* <SidebarTrigger /> */}
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
                  {files.length > 0 && (
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
                  )}
                </ScrollArea>
              </Sidebar>
            </SidebarProvider>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={80}>
          <div className="h-full flex flex-col">
            <div className="h-10 border-b flex items-center px-4">
              <div className="flex-1">
                {activeFile ? activeFile : '文档标题'}
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              {error && <div className="hint error">{error.message}</div>}
              {children}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      <div className="h-6 border-t flex items-center px-4 text-sm text-muted-foreground shrink-0">
        <div className="flex items-center space-x-4">
          <span>Markdown</span>
          <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-700" />
          <span>100 字</span>
        </div>
      </div>
    </div>
  )
}
