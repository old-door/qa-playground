import { expect, Page } from '@playwright/test'
import { BasePage } from '../../base/page'
import { TableComponent } from '../../base/table'

export class SortingDemoPage extends BasePage {
  readonly table = new TableComponent(this.page)

  constructor(page: Page){
    super(page, '/table')
  }

  async waitPageIsReady(): Promise<void> {
    await expect(this.table.locators.container()).toBeVisible()
  }
  
}