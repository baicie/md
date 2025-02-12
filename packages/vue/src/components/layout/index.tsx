import { NLayout, NLayoutSider } from 'naive-ui'
import { defineComponent, ref } from 'vue'

import { FileTree } from './file-tree'
import { Toolbar } from './toolbar'

export const Layout = defineComponent({
  name: 'Layout',
  setup(_, { slots }) {
    const collapsed = ref(false)

    return () => (
      <NLayout class="layout" hasSider>
        <NLayoutSider
          bordered
          collapseMode="width"
          collapsed={collapsed.value}
          collapsedWidth={0}
          width={250}
          showTrigger
          onUpdateCollapsed={(v) => (collapsed.value = v)}
        >
          <FileTree />
        </NLayoutSider>

        <NLayout>
          <Toolbar />

          {slots.default?.()}
        </NLayout>
      </NLayout>
    )
  },
})
