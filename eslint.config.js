// @ts-check
import { fileURLToPath } from 'node:url'

import { FlatCompat } from '@eslint/eslintrc'
import eslint from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactRefreshPlugin from 'eslint-plugin-react-refresh'
import globals from 'globals'
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
      import: importPlugin,
    },
  },

  // 忽略文件
  {
    ignores: [
      '**/{dist,target}/**',
      '**/node_modules/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/vite.config.ts',
      '**/vitest.config.ts',
      '**/tailwind.config.js',
      '**/postcss.config.js',
      '**/internal/**/*',
      '**/desktop/src-tauri/**/*.{rs,toml}',
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
          './packages/core/tsconfig.app.json',
          './packages/core/tsconfig.node.json',
          './servers/api/tsconfig.json',
          './internal/extension-markdown/tsconfig.json',
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
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'no-console': 'error',

      'import/order': [
        'error',
        {
          groups: [
            'builtin', // node 内置模块
            'external', // 外部模块
            'internal', // 内部模块
            ['parent', 'sibling'], // 父级和兄弟模块
            'index', // 当前目录下的模块
            'object', // 对象导入
            'type', // 类型导入
          ],
          'newlines-between': 'always',
        },
      ],

      // 类型导入必须使用 type
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
          disallowTypeAnnotations: true,
        },
      ],

      // 类型导出必须使用 type
      '@typescript-eslint/consistent-type-exports': [
        'error',
        {
          fixMixedExportsWithInlineTypeSpecifier: true,
        },
      ],

      // 禁止重复导入
      'import/no-duplicates': 'error',
    },
  },

  // Web 前端配置
  {
    files: ['packages/core/**/*.{ts,tsx}'],
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
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  {
    files: ['internal/extension-markdown/**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    extends: [...compat.extends('plugin:jsx-a11y/recommended')],
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
    files: [
      '**/__tests__/**/*.{ts,tsx,js,jsx}',
      '**/*.{test,spec}.{ts,tsx,js,jsx}',
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
    },
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
