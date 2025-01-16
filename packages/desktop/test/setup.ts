import { Builder, Capabilities, WebDriver } from 'selenium-webdriver'
import { Options } from 'selenium-webdriver/edge'
import { beforeAll } from 'vitest'

export let driver: WebDriver

beforeAll(async () => {
  const options = new Options()
  options.addArguments('--headless')

  const capabilities = new Capabilities()
  capabilities.set('browserName', 'MicrosoftEdge')

  driver = await new Builder()
    .withCapabilities(capabilities)
    .setEdgeOptions(options)
    .usingServer('http://localhost:4445')
    .build()
})

declare module 'vitest' {
  export interface ProvidedContext {
    driver: WebDriver
  }
}
