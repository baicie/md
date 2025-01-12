import { beforeAll, afterAll } from 'vitest'
import { chromium } from '@playwright/test'

import type { Browser } from '@playwright/test'

let browser: Browser

beforeAll(async () => {
  browser = await chromium.launch()
})

afterAll(async () => {
  await browser?.close()
})

export { browser }
