import { useEffect, useState } from 'react'
import { Toaster } from 'react-hot-toast'

import { FileProvider } from './components/layout/file-context'
import { useBlockEditor } from './hooks/use-block-editor'
import { useCollaboration } from './hooks/use-collaboration'
import { PlatformProvider } from './hooks/use-platform'
import { createPlatform } from './platform'

import type { PlatformCapabilities } from './platform/types'

import { BlockEditor } from '@/components/editor'
import { Layout } from '@/components/layout'

export default function App() {
  const providerState = useCollaboration({
    docId: '123',
    enabled: true,
  })
  const { editor } = useBlockEditor({
    ydoc: providerState.yDoc,
    provider: providerState.provider,
  })

  const [platform, setPlatform] = useState<PlatformCapabilities | null>(null)

  useEffect(() => {
    createPlatform().then(setPlatform)
  }, [])

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (!__DEV__) {
        e.preventDefault()
      }
    }

    document.addEventListener('contextmenu', handleContextMenu)

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [])

  if (!platform) {
    return <div>loading</div>
  }

  return (
    <PlatformProvider platform={platform}>
      <FileProvider editor={editor}>
        <div className="dark:bg-neutral-900 dark:text-white">
          <Layout>
            <BlockEditor editor={editor} />
          </Layout>
        </div>
        <Toaster />
      </FileProvider>
    </PlatformProvider>
  )
}
