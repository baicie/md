import tailwindcss from '@tailwindcss/postcss'
import autoprefixer from 'autoprefixer'
import postcssNested from 'postcss-nested'
import postcssNormalize from 'postcss-normalize'
import postcssPresetEnv from 'postcss-preset-env'

export default {
  plugins: [
    autoprefixer({
      flexbox: true,
      grid: true,
    }),
    tailwindcss(),
    postcssNested({
      bubble: ['screen', 'dark'],
    }),
    postcssPresetEnv({
      stage: 3,
      features: {
        'nesting-rules': true,
        'custom-properties': true,
        'place-properties': true,
      },
    }),
    postcssNormalize(),
  ],
}
