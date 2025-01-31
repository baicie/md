import { useState } from 'react'

import { Button } from '../ui/button'
import { useFiles } from './file-context'
import { Sidebar } from './sidebar'

import { Icon } from '@/components/ui/icon'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const [width, setWidth] = useState(20)
  const { activeFile, handleSave, error } = useFiles()
  return (
    <div className="h-screen w-full flex flex-col bg-white dark:bg-neutral-900">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={width}
          minSize={15}
          maxSize={30}
          onResize={setWidth}
        >
          <Sidebar />
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={80}>
          <div className="h-full flex flex-col">
            <div className="h-10 border-b flex items-center px-4">
              <div className="flex-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {activeFile ? (
                    <span className="text-sm font-medium">
                      {activeFile.name}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      文档标题
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={handleSave}
                    disabled={!activeFile}
                    style={{
                      cursor: 'pointer',
                    }}
                  >
                    <Icon name="Save" className="size-4 mr-1" />
                    <span>保存</span>
                  </Button>
                </div>
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
