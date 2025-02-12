import { NConfigProvider } from 'naive-ui'
import { defineComponent, ref, watchEffect } from 'vue'

import { Layout } from '@/components/layout'
import { useFileStore } from '@/stores/file'
import { useLocaleStore } from '@/stores/locale'
import { useThemeStore } from '@/stores/theme'

export default defineComponent({
  name: 'App',
  setup() {
    const { getCurrentTheme } = useThemeStore()
    const { getCurrentLocale } = useLocaleStore()
    const { activeFile } = useFileStore()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const PageComponent = ref<any>(null)

    watchEffect(async () => {
      if (!activeFile) {
        PageComponent.value = null
        return
      }

      const fileType = activeFile.name.split('.').pop()?.toLowerCase()
      let module

      switch (fileType) {
        case 'md':
          module = await import('./pages/markdown')
          PageComponent.value = module.default
          break
        case 'json':
          module = await import('./pages/json')
          PageComponent.value = module.default
          break
        case 'txt':
          module = await import('./pages/text')
          PageComponent.value = module.default
          break
        default:
          module = await import('./pages/default')
          PageComponent.value = module.default
      }
    })

    return () => (
      <NConfigProvider
        theme={getCurrentTheme().theme}
        locale={getCurrentLocale().locale}
      >
        <Layout>
          {PageComponent.value ? (
            <PageComponent.value />
          ) : (
            <div>请选择文件</div>
          )}
        </Layout>
      </NConfigProvider>
    )
  },
})
