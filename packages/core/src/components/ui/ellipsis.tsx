import * as React from 'react'

import { Tooltip } from './tootip'

import { cn } from '@/lib/utils'

export interface EllipsisProps {
  /**
   * 要显示的文本内容或渲染函数
   */
  children: string | ((props: { className?: string }) => React.ReactNode)
  /**
   * 是否显示 tooltip，默认为 true
   */
  tooltip?: boolean
  /**
   * 自定义 tooltip 内容
   */
  tooltipContent?: string
  className?: string
}

export const Ellipsis = React.forwardRef<HTMLSpanElement, EllipsisProps>(
  ({ children, tooltip = true, tooltipContent, className, ...props }, ref) => {
    const content =
      typeof children === 'function' ? (
        children({ className: cn('truncate', className) })
      ) : (
        <span ref={ref} className={cn('truncate', className)} {...props}>
          {children}
        </span>
      )

    if (tooltip) {
      return (
        <Tooltip
          title={
            tooltipContent ?? (typeof children === 'string' ? children : '')
          }
          spanClassName={'truncate'}
        >
          {content}
        </Tooltip>
      )
    }

    return content
  },
)

Ellipsis.displayName = 'Ellipsis'
