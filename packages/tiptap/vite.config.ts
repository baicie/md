import { defineConfig, mergeConfig } from 'vite'
import path from 'node:path'
import pkg from './package.json'
import { viteCommonConfig } from '@baicie/md-common'
import { visualizer } from 'rollup-plugin-visualizer'
import dts from 'vite-plugin-dts'

const defaultConfig = defineConfig({
  plugins: [dts({ tsconfigPath: './tsconfig.app.json' })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    minify: false,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        ...Object.keys(pkg.dependencies),
        ...Object.keys(pkg.peerDependencies),
      ],
      plugins: [visualizer({ open: false })],
    },
  },
})

// https://vitejs.dev/config/
export default mergeConfig(defaultConfig, viteCommonConfig)
