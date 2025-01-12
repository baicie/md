import { describe, test, expect, beforeEach, afterEach } from 'vitest'

import { setupE2E, teardownE2E } from '../test/e2e/utils'

import type { Browser, Page } from '@playwright/test'

describe('Theme Switching', () => {
  let browser: Browser
  let page: Page
  let baseUrl: string

  beforeEach(async () => {
    const context = await setupE2E()
    browser = context.browser
    page = context.page
    baseUrl = context.baseUrl
    await page.goto(baseUrl)
  })

  afterEach(async () => {
    await teardownE2E({ browser, page, baseUrl })
  })

  test('should toggle theme and persist', async () => {
    // 获取主题按钮和 html 元素
    const themeButton = page.getByRole('button', {
      name: /dark mode|light mode/i,
    })
    const html = page.locator('html')

    // 点击切换到暗色主题
    await themeButton.click()
    expect(await html.evaluate((el) => el.classList.contains('dark'))).toBe(
      true,
    )
    expect(await themeButton.locator('svg').getAttribute('data-icon')).toBe(
      'sun',
    )

    // 刷新页面，验证持久化
    await page.reload()
    expect(
      await html.evaluate((el: Element) => el.classList.contains('dark')),
    ).toBe(true)

    // 再次切换回亮色主题
    await themeButton.click()
    expect(
      await html.evaluate((el: Element) => el.classList.contains('dark')),
    ).toBe(false)
    expect(await themeButton.locator('svg').getAttribute('data-icon')).toBe(
      'moon',
    )
  })

  test('should respect system preference', async () => {
    // 模拟系统暗色主题
    await page.emulateMedia({ colorScheme: 'dark' })
    await page.reload()

    const html = page.locator('html')
    await expect(
      await html.evaluate((el: Element) => el.classList.contains('dark')),
    ).toBe(true)
  })
})
