import react from '@vitejs/plugin-react-swc'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import { appName } from './package.json'

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
    server: {
      port: 1420,
    },
    envPrefix: ['VITE_', 'TAURI_ENV_*'],
    define: {
      __PLATFORM__: JSON.stringify(env.VITE_APP_PLATFORM || 'web'),
      __VERSION__: JSON.stringify(env.VITE_APP_VERSION),
      __DEV__: mode !== 'production',
      __APP_NAME__: JSON.stringify(appName),
    },
    build: {
      target:
        process.env.TAURI_ENV_PLATFORM == 'windows' ? 'chrome105' : 'safari13',
      minify: !process.env.TAURI_ENV_DEBUG ? 'esbuild' : false,
      sourcemap: !!process.env.TAURI_ENV_DEBUG,
      emptyOutDir: true,
      rollupOptions: {
        output: {
          chunkFileNames: 'js/[name].[hash].js',
          entryFileNames: 'js/[name].[hash].js',
          manualChunks(id) {
            if (id.includes('node_modules')) {
              const directories = id.toString().split('node_modules/')
              if (directories.length > 2) {
                return directories[2].split('/')[0].toString()
              }
              return directories[1].split('/')[0].toString()
            }
          },
        },
      },
    },
  }
})
