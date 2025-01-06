// @ts-check
import { FlatCompat } from '@eslint/eslintrc'
import eslint from '@eslint/js'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactRefreshPlugin from 'eslint-plugin-react-refresh'
import globals from 'globals'
import { fileURLToPath } from 'node:url'
import * as tseslint from 'typescript-eslint'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const compat = new FlatCompat({ baseDirectory: __dirname })

export default tseslint.config(
  // 插件配置
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'jsx-a11y': jsxA11yPlugin,
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefreshPlugin,
    },
  },

  // 忽略文件
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/vite.config.ts',
      '**/vitest.config.ts',
      '**/tailwind.config.js',
      '**/postcss.config.js',
    ],
  },

  // 基础配置
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,

  // 通用配置
  {
    languageOptions: {
      globals: {
        ...globals.es2022,
      },
      parserOptions: {
        project: [
          './tsconfig.json',
          './packages/web/tsconfig.app.json',
          './packages/web/tsconfig.node.json',
          './servers/api/tsconfig.json',
        ],
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'no-console': 'error',
    },
  },

  // Web 前端配置
  {
    files: ['packages/web/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    extends: [
      ...compat.extends('plugin:jsx-a11y/recommended'),
      ...compat.extends('plugin:react/recommended'),
      ...compat.extends('plugin:react-hooks/recommended'),
    ],
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // NestJS 后端配置
  {
    files: ['servers/api/**/*.ts'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // 测试文件配置
  {
    files: ['**/__tests__/**/*.{ts,tsx}', '**/*.test.{ts,tsx}'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // 类型定义文件配置
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },
)
