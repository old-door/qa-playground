import { Page } from '@playwright/test'

export abstract class BasePage {

  protected constructor(readonly page: Page, readonly url: string) {
  }

  async open():Promise<void> {
    await this.page.goto(this.url)
    await this.waitPageIsReady()
  }

  async reload() {
    await this.page.reload()
    await this.waitPageIsReady()
  }

  abstract waitPageIsReady():Promise<void>

}