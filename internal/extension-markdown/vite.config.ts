/// <reference types="vitest" />
import { babel } from '@rollup/plugin-babel'
import * as path from 'node:path'
import { defineConfig } from 'vite'
import packageJson from './package.json'

export default defineConfig(() => {
  const deps = {
    ...(packageJson.dependencies || {}),
    ...(packageJson.peerDependencies || {}),
  }
  return {
    build: {
      lib: {
        entry: path.resolve(__dirname, 'src/index.js'),
        formats: ['es', 'cjs'] as const,
        fileName: (format) => `index.${format}.js`,
      },
      rollupOptions: {
        external: [...Object.keys(deps), /^@tiptap/],
      },
      sourcemap: true,
      minify: false,
    },
    plugins: [
      babel({
        babelHelpers: 'bundled',
        exclude: 'node_modules/**',
      }),
    ],
  }
})
