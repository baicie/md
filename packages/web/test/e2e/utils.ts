import { chromium } from '@playwright/test'

import type { Browser, Page } from '@playwright/test'

interface E2EContext {
  browser: Browser
  page: Page
  baseUrl: string
}

export async function setupE2E(): Promise<E2EContext> {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  const baseUrl = 'http://localhost:5173'

  return {
    browser,
    page,
    baseUrl,
  }
}

export async function teardownE2E({ browser, page }: E2EContext) {
  await page.close()
  await browser.close()
}
