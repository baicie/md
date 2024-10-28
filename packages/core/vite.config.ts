import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'node:path'
import pkg from './package.json'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import defaultTheme from 'tailwindcss/defaultTheme'
import tailwindcssAnimate from 'tailwindcss-animate'
import tailwindcssTypography from '@tailwindcss/typography'

// https://vitejs.dev/config/
export default defineConfig((env) => {
  console.log('patth', env)

  return {
    clearScreen: false,
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    css: {
      postcss: {
        plugins: [
          tailwindcss({
            darkMode: ['class'],
            content: ['./tiptap/**/*.{ts,tsx}'],
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
    build: {
      minify: false,
      rollupOptions: {
        input: path.resolve(__dirname, 'src/App.tsx'),
        output: {
          dir: path.resolve(__dirname, 'dist'),
          entryFileNames: 'main.js',
          format: 'es',
        },
        external: [...Object.keys(pkg.dependencies)],
      },
    },
  }
})
