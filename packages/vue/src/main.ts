import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App'
import { i18n } from './i18n'

import { createPlatformProvider } from '@/hooks/use-platform'
import { createPlatform } from '@/platform'
import './styles/index.css'

async function bootstrap() {
  const platform = await createPlatform()
  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)
  app.use(i18n)
  app.use(createPlatformProvider(platform))
  app.mount('#app')
}

bootstrap()
