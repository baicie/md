import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    define: {
      __PLATFORM__: JSON.stringify(env.VITE_APP_PLATFORM || 'web'),
      __VERSION__: JSON.stringify(env.VITE_APP_VERSION),
      __DEV__: mode !== 'production',
      __APP_NAME__: JSON.stringify('MD Editor'),
    },
    build: {
      outDir:
        process.env.VITE_APP_PLATFORM === 'desktop'
          ? '../desktop/dist'
          : 'dist',
    },
  }
})
