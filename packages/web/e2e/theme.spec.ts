import { expect, test } from 'vitest'

import { browser, page, viteTestUrl } from '../test/utils'

test('theme toggle', async () => {
  const themeButton = page.getByRole('button', {
    name: /toggle theme/i,
  })

  const html = page.locator('html')

  // 点击切换到暗色主题
  await themeButton.click()
  expect(await html.evaluate((el: any) => el.classList.contains('dark'))).toBe(
    true,
  )
  expect(await themeButton.locator('svg').getAttribute('data-icon')).toBe('Sun')

  // 刷新页面，验证持久化
  await page.reload()
  expect(await html.evaluate((el: any) => el.classList.contains('dark'))).toBe(
    true,
  )

  // 再次切换回亮色主题
  await themeButton.click()
  expect(await html.evaluate((el: any) => el.classList.contains('dark'))).toBe(
    false,
  )
  expect(await themeButton.locator('svg').getAttribute('data-icon')).toBe(
    'Moon',
  )
})

test('system preference', async () => {
  const newPage = await browser.newPage()

  await newPage.emulateMedia({ colorScheme: 'dark' })
  await newPage.goto(viteTestUrl)

  const html = newPage.locator('html')
  expect(await html.evaluate((el: any) => el.classList.contains('dark'))).toBe(
    true,
  )

  // 切换到浅色主题并等待 DOM 变化
  await newPage.emulateMedia({ colorScheme: 'light' })
  await newPage.waitForFunction(
    () => {
      return !document.documentElement.classList.contains('dark')
    },
    { timeout: 2000 },
  )

  expect(await html.evaluate((el: any) => el.classList.contains('dark'))).toBe(
    false,
  )

  await newPage.close()
})
