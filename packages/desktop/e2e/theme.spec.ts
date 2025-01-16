import { By } from 'selenium-webdriver'
import { expect, test } from 'vitest'

import { driver } from '../test/setup'

test('theme toggle', async () => {
  const themeButton = await driver.findElement(By.className(''))
  const html = await driver.findElement(By.css('html'))

  // 点击切换到暗色主题
  await themeButton.click()
  expect(await html.getAttribute('class')).toContain('dark')
  expect(
    await themeButton.findElement(By.css('svg')).getAttribute('data-icon'),
  ).toBe('Sun')

  // 刷新页面，验证持久化
  await driver.navigate().refresh()
  expect(await html.getAttribute('class')).toContain('dark')

  // 再次切换回亮色主题
  await themeButton.click()
  expect(await html.getAttribute('class')).not.toContain('dark')
  expect(
    await themeButton.findElement(By.css('svg')).getAttribute('data-icon'),
  ).toBe('Moon')
})
