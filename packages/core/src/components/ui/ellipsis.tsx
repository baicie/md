import * as React from 'react'

import { cn } from '@/lib/utils'

export interface EllipsisProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 要显示的文本内容
   */
  children: string
  /**
   * 最大行数，默认为 1
   */
  lines?: number
  /**
   * 是否显示 tooltip，默认为 true
   */
  tooltip?: boolean
  /**
   * 自定义 tooltip 内容
   */
  tooltipContent?: string
}

export const Ellipsis = React.forwardRef<HTMLDivElement, EllipsisProps>(
  (
    {
      children,
      lines = 1,
      tooltip = true,
      tooltipContent,
      className,
      ...props
    },
    _ref,
  ) => {
    const [isOverflow, setIsOverflow] = React.useState(false)
    const textRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
      const element = textRef.current
      if (!element) return

      const checkOverflow = () => {
        const isTextOverflow =
          element.scrollHeight > element.clientHeight ||
          element.scrollWidth > element.clientWidth
        setIsOverflow(isTextOverflow)
      }

      checkOverflow()

      const resizeObserver = new ResizeObserver(checkOverflow)
      resizeObserver.observe(element)

      return () => {
        resizeObserver.disconnect()
      }
    }, [children])

    const content = (
      <div
        ref={textRef}
        className={cn(
          'overflow-hidden',
          lines === 1
            ? 'text-nowrap'
            : 'display-webkit-box [-webkit-box-orient:vertical]',
          className,
        )}
        style={
          lines > 1
            ? {
                WebkitLineClamp: lines,
              }
            : undefined
        }
        {...props}
      >
        {children}
      </div>
    )

    if (tooltip && isOverflow) {
      return (
        <div
          title={tooltipContent ?? children}
          className="inline-block max-w-full"
        >
          {content}
        </div>
      )
    }

    return content
  },
)

Ellipsis.displayName = 'Ellipsis'
