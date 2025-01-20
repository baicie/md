import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  './packages/core/vitest.config.ts',
  './internal/extension-markdown/vitest.config.ts',
])
