import { ChevronRight, File, Folder } from 'lucide-react'
import { useCallback, useState } from 'react'

import { FileSelector } from '../composite/file-select'

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
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { usePlatform } from '@/hooks/use-platform'
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
                key={child.path}
                file={child}
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
        className="gap-2"
      >
        <File className="size-4" />
        <span>{file.name}</span>
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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [width, setWidth] = useState(20)
  const { logger } = usePlatform()

  const handleFileSelect = (selectedFiles: FileNode[]) => {
    setFiles(selectedFiles)
  }

  const handleFileClick = useCallback(
    async (file: FileNode) => {
      try {
        setIsLoading(true)
        if (file.type === 'file') {
          setActiveFile(file.path)
          const content = await file.raw.text()
          logger.debug('content', content)
          editor?.commands.setContent(content)
        }
      } catch (error) {
        logger.error('Failed to load file', error)
        setError(error as Error)
      } finally {
        setIsLoading(false)
      }
    },
    [editor?.commands, logger],
  )

  return (
    <div className="h-screen w-full flex flex-col bg-white dark:bg-neutral-900">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={width}
          minSize={15}
          maxSize={30}
          onResize={setWidth}
        >
          <SidebarProvider defaultOpen>
            <Sidebar variant="inset" className="flex-1">
              <SidebarHeader className="border-b border-neutral-200 dark:border-neutral-700 w-full">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-900 dark:text-white">文件</span>
                  <div className="flex items-center gap-2">
                    <SidebarTrigger />
                    <button
                      onClick={toggleTheme}
                      className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md"
                      aria-label="切换主题"
                    >
                      <Icon
                        name={theme === 'dark' ? 'Sun' : 'Moon'}
                        className="size-4"
                      />
                    </button>
                  </div>
                </div>
              </SidebarHeader>
              <SidebarContent>
                <div className="space-y-4">
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
                </div>
              </SidebarContent>
            </Sidebar>
          </SidebarProvider>
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
              {isLoading && (
                <div className="hint purple-spinner">Processing...</div>
              )}
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
