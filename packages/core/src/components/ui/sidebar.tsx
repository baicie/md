import { ChevronLeft } from 'lucide-react'
import * as React from 'react'

import { ScrollArea } from './scroll-area'

import { cn } from '@/lib/utils'

interface SidebarContext {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
  width: number
  setWidth: (width: number) => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

interface SidebarProviderProps {
  children: React.ReactNode
  defaultCollapsed?: boolean
  defaultWidth?: number
  minWidth?: number
  maxWidth?: number
}

export function SidebarProvider({
  children,
  defaultCollapsed = false,
  defaultWidth = 280,
  minWidth = 200,
  maxWidth = 500,
}: SidebarProviderProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)
  const [width, setWidth] = React.useState(defaultWidth)

  const handleSetWidth = React.useCallback(
    (newWidth: number) => {
      setWidth(Math.min(Math.max(newWidth, minWidth), maxWidth))
    },
    [maxWidth, minWidth],
  )

  return (
    <SidebarContext.Provider
      value={{
        collapsed,
        setCollapsed,
        width,
        setWidth: handleSetWidth,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

interface SidebarProps {
  children?: React.ReactNode
  className?: string
}

export function Sidebar({ children, className }: SidebarProps) {
  const { collapsed, setCollapsed, width, setWidth } = useSidebar()
  const [isDragging, setIsDragging] = React.useState(false)
  const sidebarRef = React.useRef<HTMLDivElement>(null)

  // 处理拖拽调整宽度
  React.useEffect(() => {
    const sidebar = sidebarRef.current
    if (!sidebar) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const newWidth = e.clientX
      setWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, setWidth])

  return (
    <div
      ref={sidebarRef}
      className={cn(
        'relative flex h-full flex-shrink-0 flex-col overflow-hidden border-r border-neutral-200 bg-white transition-[width] duration-300 ease-in-out dark:border-neutral-800 dark:bg-neutral-900',
        collapsed ? 'w-[50px]' : `w-[${width}px]`,
        className,
      )}
    >
      {/* 拖拽手柄 */}
      {!collapsed && (
        // eslint-disable-next-line jsx-a11y/role-supports-aria-props
        <div
          role="presentation"
          aria-orientation="vertical"
          aria-valuenow={width}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') setWidth(width - 10)
            if (e.key === 'ArrowRight') setWidth(width + 10)
          }}
          className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-neutral-200 dark:hover:bg-neutral-800"
          onMouseDown={() => setIsDragging(true)}
        />
      )}

      {/* 折叠按钮 */}
      <div className="flex h-[60px] items-center justify-between px-4 py-2">
        <h2
          className={cn(
            'text-lg font-semibold transition-opacity',
            collapsed && 'opacity-0',
          )}
        >
          侧边栏
        </h2>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <ChevronLeft
            className={cn(
              'h-5 w-5 transition-transform',
              collapsed && 'rotate-180',
            )}
          />
        </button>
      </div>

      {/* 内容区域 */}
      <div className={cn('flex-1 overflow-hidden', collapsed && 'opacity-0')}>
        <ScrollArea>{children}</ScrollArea>
      </div>
    </div>
  )
}
