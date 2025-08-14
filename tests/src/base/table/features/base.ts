import { expect, Page, test } from '@playwright/test'
import { TableLocators } from '../table.locators'
import { TableColumn } from '../column'
export class BaseTableFeature {

  readonly locators: TableLocators

  constructor(protected readonly page: Page, options?: { locators?: TableLocators }) {
    const {
      locators
    } = options ?? {}
    this.locators = locators ?? new TableLocators(page)
  }

  getColumnValues(column: TableColumn | string): Promise<string[]> {
    return test.step(`Get ${column} column values`, async () => {
      const headers: string [] = await this.locators.headers().allTextContents()
      const columnIndex = headers.findIndex(item => item.startsWith( String(column)))
      expect(columnIndex, `To find ${column} column index`).toBeGreaterThanOrEqual(0)
      return this.locators
        .rows()
        .locator(this.locators.cells().nth(columnIndex))
        .describe(`All cells of ${column} column`)
        .allTextContents()
    })
  }

}