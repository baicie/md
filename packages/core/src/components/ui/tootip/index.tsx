import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import * as React from 'react'
import Tippy from '@tippyjs/react/headless'
import { useCallback } from 'react'

import type { JSX } from 'react'
import type { TippyProps, TooltipProps } from './types'

import { cn } from '@/lib/utils'

const isMac =
  typeof window !== 'undefined'
    ? /Mac|iPod|iPhone|iPad/.test(window.navigator.userAgent)
    : false

const ShortcutKey = ({ children }: { children: string }): JSX.Element => {
  const className =
    'inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-[0.625rem] rounded font-semibold leading-none border border-neutral-200 text-neutral-500 border-b-2 whitespace-nowrap'

  if (children === 'Mod') {
    return <kbd className={className}>{isMac ? '⌘' : 'Ctrl'}</kbd>
  }

  if (children === 'Shift') {
    return <kbd className={className}>⇧</kbd>
  }

  if (children === 'Alt') {
    return <kbd className={className}>⌥</kbd>
  }

  return <kbd className={className}>{children}</kbd>
}

export const Tooltip = ({
  children,
  enabled = true,
  title,
  shortcut,
  tippyOptions = {},
}: TooltipProps): JSX.Element => {
  const renderTooltip = useCallback(
    (attrs: TippyProps) => (
      <span
        className="inline-flex items-center gap-2 px-2.5 py-1.5 bg-white border border-neutral-100 rounded-lg shadow-sm z-[999]"
        tabIndex={-1}
        data-placement={attrs['data-placement']}
        data-reference-hidden={attrs['data-reference-hidden']}
        data-escaped={attrs['data-escaped']}
      >
        {title && (
          <span className="text-xs font-medium text-neutral-700">{title}</span>
        )}
        {shortcut && (
          <span className="flex items-center gap-0.5 text-neutral-500">
            {shortcut.map((shortcutKey) => (
              <ShortcutKey key={shortcutKey}>{shortcutKey}</ShortcutKey>
            ))}
          </span>
        )}
      </span>
    ),
    [shortcut, title],
  )

  if (enabled) {
    return (
      <Tippy
        delay={500}
        offset={[0, 8]}
        touch={false}
        zIndex={99999}
        appendTo={document.body}
        {...tippyOptions}
        render={renderTooltip}
      >
        <span>{children}</span>
      </Tippy>
    )
  }

  return <>{children}</>
}

const TooltipProvider = TooltipPrimitive.Provider

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { TooltipContent, TooltipProvider, TooltipTrigger }
export default Tooltip
