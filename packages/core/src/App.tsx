import { useEffect, useState } from 'react'

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
      </FileProvider>
    </PlatformProvider>
  )
}
