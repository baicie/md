import './globals.css'

import 'cal-sans'

import '@fontsource/inter/100.css'
import '@fontsource/inter/200.css'
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'

import { TiptapCollabProvider } from '@hocuspocus/provider'
import 'iframe-resizer/js/iframeResizer.contentWindow'
import { useMemo, useState } from 'react'
import { Doc as YDoc } from 'yjs'

import { BlockEditor } from '@/tiptap/components/BlockEditor'

export default function TipTap() {
  const [provider] = useState<TiptapCollabProvider | null>(null)

  const ydoc = useMemo(() => new YDoc(), [])

  return <BlockEditor ydoc={ydoc} provider={provider} />
}
