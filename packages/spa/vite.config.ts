import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'node:path'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import defaultTheme from 'tailwindcss/defaultTheme'
import tailwindcssAnimate from 'tailwindcss-animate'
import tailwindcssTypography from '@tailwindcss/typography'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      tsDecorators: true,
    }),
  ],
  build: {
    emptyOutDir: true,
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name].[hash].js',
        entryFileNames: 'js/[name].[hash].js',
        manualChunks(id) {
          // 处理 pnpm 的依赖路径
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
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../core/src'),
    },
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss({
          darkMode: ['class'],
          content: ['../core/tiptap/**/*.{ts,tsx}'],
          safelist: ['ProseMirror'],
          theme: {
            extend: {
              fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
              },
            },
          },
          plugins: [tailwindcssAnimate, tailwindcssTypography],
        }),
        autoprefixer(),
      ],
    },
  },
})
