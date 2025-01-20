import Tippy from '@tippyjs/react/headless'
import { useCallback } from 'react'

import type { JSX } from 'react'
import type { TippyProps, TooltipProps } from './types'

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
  className,
  spanClassName,
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
        className={className}
        delay={500}
        offset={[0, 8]}
        touch={false}
        zIndex={99999}
        appendTo={document.body}
        {...tippyOptions}
        render={renderTooltip}
      >
        <span className={spanClassName}>{children}</span>
      </Tippy>
    )
  }

  return <>{children}</>
}

export default Tooltip
