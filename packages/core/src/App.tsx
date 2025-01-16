import { useCollaboration } from './hooks/useCollaboration'

import { BlockEditor } from '@/components/editor'
import { Layout } from '@/components/layout'

export default function App() {
  const providerState = useCollaboration({
    docId: '123',
    enabled: true,
  })

  return (
    <div className="dark:bg-neutral-900 dark:text-white">
      <Layout>
        <div className="text-red-500">{__PLATFORM__}</div>
        <BlockEditor
          ydoc={providerState.yDoc}
          provider={providerState.provider}
        />
      </Layout>
    </div>
  )
}
