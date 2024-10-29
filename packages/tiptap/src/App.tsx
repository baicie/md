import { TiptapCollabProvider } from '@hocuspocus/provider'
import 'iframe-resizer/js/iframeResizer.contentWindow'
import { useSearchParams } from 'next/navigation'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import { Doc as YDoc } from 'yjs'

import { BlockEditor } from '@/components/BlockEditor'
import { createPortal } from 'react-dom'
import { Surface } from '@/components/ui/Surface'
import { Toolbar } from '@/components/ui/Toolbar'
import { Icon } from '@/components/ui/Icon'

import './styles/globals.css'
import './styles/index.css'
import 'cal-sans'

import '@fontsource/inter/100.css'
import '@fontsource/inter/200.css'
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

const useDarkmode = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false,
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => setIsDarkMode(mediaQuery.matches)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  const toggleDarkMode = useCallback(
    () => setIsDarkMode((isDark) => !isDark),
    [],
  )
  const lightMode = useCallback(() => setIsDarkMode(false), [])
  const darkMode = useCallback(() => setIsDarkMode(true), [])

  return {
    isDarkMode,
    toggleDarkMode,
    lightMode,
    darkMode,
  }
}

export default function Document() {
  const { isDarkMode, darkMode, lightMode } = useDarkmode()
  const [provider, setProvider] = useState<TiptapCollabProvider | null>(null)
  const [collabToken, setCollabToken] = useState<string | null | undefined>()
  const [aiToken, setAiToken] = useState<string | null | undefined>()
  const searchParams = useSearchParams()

  const hasCollab =
    parseInt(searchParams?.get('noCollab') as string) !== 1 &&
    collabToken !== null

  const ydoc = useMemo(() => new YDoc(), [])

  useLayoutEffect(() => {
    if (hasCollab && collabToken) {
      setProvider(
        new TiptapCollabProvider({
          name: `${process.env.NEXT_PUBLIC_COLLAB_DOC_PREFIX}`,
          appId: process.env.NEXT_PUBLIC_TIPTAP_COLLAB_APP_ID ?? '',
          token: collabToken,
          document: ydoc,
        }),
      )
    }
  }, [setProvider, collabToken, ydoc, hasCollab])

  const DarkModeSwitcher = createPortal(
    <Surface className="flex items-center gap-1 fixed bottom-6 right-6 z-[99999] p-1">
      <Toolbar.Button onClick={lightMode} active={!isDarkMode}>
        <Icon name="Sun" />
      </Toolbar.Button>
      <Toolbar.Button onClick={darkMode} active={isDarkMode}>
        <Icon name="Moon" />
      </Toolbar.Button>
    </Surface>,
    document.body,
  )

  return (
    <>
      {DarkModeSwitcher}
      <BlockEditor ydoc={ydoc} />
    </>
  )
}
