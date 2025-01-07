// import TiptapEditor from './components/tiptap'

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

export default function App() {
  return (
    <div className="h-screen w-full flex flex-col">
      {/* 顶部工具栏 */}
      <div className="h-12 w-full border-b flex items-center px-4 shrink-0">
        <div className="flex items-center space-x-4">{/* 工具栏按钮 */}</div>
      </div>

      {/* 主体内容 */}
      <ResizablePanelGroup direction="horizontal" className="flex-1 w-full">
        {/* 左侧文件树 */}
        <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
          <div className="h-full w-full flex flex-col">
            <div className="h-10 w-full border-b flex items-center px-4">
              Files
            </div>
            <ScrollArea className="flex-1 w-full">
              {/* 文件树内容 */}
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
            <ScrollArea className="flex-1 w-full p-4">
              {/* <TiptapEditor /> */}
            </ScrollArea>
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
