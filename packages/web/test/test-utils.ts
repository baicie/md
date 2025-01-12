import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

import type { ReactElement } from 'react'

// 扩展 render 方法
function customRender(ui: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(ui),
  }
}

// 创建 Mock 函数的工具方法
function createMock<T extends (...args: unknown[]) => unknown>(
  implementation?: T,
): { mock: ReturnType<typeof vi.fn>; type: T } {
  return {
    mock: vi.fn(implementation),
    type: undefined as unknown as T,
  }
}

/**
 * zh 等待条件满足的工具方法
 * en Wait for a condition to be met
 * @param callback
 * @param param1
 * @returns
 */
async function waitFor(
  callback: () => boolean | Promise<boolean>,
  { timeout = 1000, interval = 50 } = {},
): Promise<void> {
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    if (await callback()) return
    await new Promise((resolve) => setTimeout(resolve, interval))
  }

  throw new Error('Timeout waiting for condition')
}

export * from '@testing-library/react'
export { customRender as render, createMock, waitFor }
