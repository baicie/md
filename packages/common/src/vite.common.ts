import { defineConfig } from 'vite'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import defaultTheme from 'tailwindcss/defaultTheme'
import tailwindcssAnimate from 'tailwindcss-animate'
import tailwindcssTypography from '@tailwindcss/typography'
import react from '@vitejs/plugin-react-swc'

export const viteCommonConfig = defineConfig({
  css: {
    postcss: {
      plugins: [
        tailwindcss({
          darkMode: ['class'],
          content: ['./**/*.{ts,tsx}'],
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
  },
  plugins: [react()],
})
