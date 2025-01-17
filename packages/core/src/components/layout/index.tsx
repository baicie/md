import { FileSelector } from '../ui/file-select'

import { Icon } from '@/components/ui/Icon'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Toolbar } from '@/components/ui/Toolbar'
import { useThemeStore } from '@/stores/theme'

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { theme, toggleTheme } = useThemeStore()

  return (
    <div className="h-screen w-full flex flex-col bg-white dark:bg-neutral-900">
      {/* 主体内容 */}
      <ResizablePanelGroup direction="horizontal" className="flex-1 w-full">
        {/* 左侧文件树 */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="h-full w-full flex flex-col bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700">
            <div className="h-10 w-full border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between px-4 text-neutral-900 dark:text-white">
              <span>Files</span>
              <Toolbar.Button
                tooltip={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                <Icon name={theme === 'dark' ? 'Sun' : 'Moon'} />
              </Toolbar.Button>
            </div>
            <ScrollArea className="flex-1 w-full">
              <FileSelector />
            </ScrollArea>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {/* 编辑器区域 */}
        <ResizablePanel defaultSize={80}>
          <div className="h-full w-full flex flex-col">
            <div className="h-10 w-full border-b flex items-center px-4">
              <div className="flex-1">Document Title</div>
            </div>
            {children}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      {/* 底部状态栏 */}
      <div className="h-6 w-full border-t flex items-center px-4 text-sm text-muted-foreground shrink-0">
        <div className="flex items-center space-x-4">
          <span>Markdown</span>
          <Separator orientation="vertical" className="h-4" />
          <span>100 words</span>
        </div>
      </div>
    </div>
  )
}
