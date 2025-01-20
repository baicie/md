import * as React from 'react'

import { cn } from '@/lib/utils'

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 内容区域的类名
   */
  contentClassName?: string
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, contentClassName, children, ...props }, ref) => {
    const scrollContainerRef = React.useRef<HTMLDivElement>(null)
    const [showScrollbar, setShowScrollbar] = React.useState(false)
    const [scrollInfo, setScrollInfo] = React.useState({
      thumbHeight: 0,
      thumbTop: 0,
    })

    React.useEffect(() => {
      const container = scrollContainerRef.current
      if (!container) return

      const checkScroll = () => {
        setShowScrollbar(container.scrollHeight > container.clientHeight)
        updateThumbPosition()
      }

      const updateThumbPosition = () => {
        if (!container) return
        const { clientHeight, scrollHeight, scrollTop } = container
        const thumbHeight = (clientHeight / scrollHeight) * clientHeight
        const thumbTop = (scrollTop / scrollHeight) * clientHeight
        setScrollInfo({ thumbHeight, thumbTop })
      }

      container.addEventListener('scroll', updateThumbPosition)
      checkScroll()
      const observer = new ResizeObserver(checkScroll)
      observer.observe(container)

      return () => {
        observer.disconnect()
        container.removeEventListener('scroll', updateThumbPosition)
      }
    }, [])

    return (
      <div
        ref={ref}
        className={cn('overflow-hidden flex-1 w-full relative', className)}
        {...props}
      >
        <div
          ref={scrollContainerRef}
          className={cn('h-full w-full overflow-y-auto scrollbar-none')}
        >
          <div
            className={cn(
              'flex flex-col space-y-4 px-6 py-4 min-w-0',
              contentClassName,
            )}
          >
            {children}
          </div>
        </div>
        {showScrollbar && (
          <div
            className={cn(
              'absolute right-0 top-0 h-full w-2.5',
              'bg-neutral-100/50 dark:bg-neutral-800/50',
              'hover:bg-neutral-200/50 dark:hover:bg-neutral-700/50',
              'transition-colors',
            )}
          >
            <div
              className={cn(
                'relative rounded-full',
                'bg-neutral-300/50 dark:bg-neutral-600/50',
                'hover:bg-neutral-400/50 dark:hover:bg-neutral-500/50',
              )}
              style={{
                height: `${scrollInfo.thumbHeight}px`,
                transform: `translateY(${scrollInfo.thumbTop}px)`,
              }}
            />
          </div>
        )}
      </div>
    )
  },
)

ScrollArea.displayName = 'ScrollArea'

export { ScrollArea }
