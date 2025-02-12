import { defineComponent } from 'vue'

import { Editor } from '@/components/editor'
import { Layout } from '@/components/layout'

export default defineComponent({
  name: 'EditorPage',
  setup() {
    return () => (
      <Layout>
        <Editor />
      </Layout>
    )
  },
})
