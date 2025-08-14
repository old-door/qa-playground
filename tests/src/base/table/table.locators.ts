import { Locator } from '@playwright/test'
import { Locators } from '../locators'
import { TableColumn } from './column'

export class TableLocators extends Locators {

  container(): Locator {
    return this.page.locator('//table').describe('Table container')
  }

  headers(): Locator {
    return this.container().locator('//th').describe('Table headers')
  }

  headerByColumn(column: TableColumn | string): Locator {
    return this.headers().filter({ hasText: String(column)}).describe(`Column ${column} header`)
  }

  rows(): Locator {
    return this.container().locator('//tbody//tr').describe('Table rows')
  }

  cells(): Locator {
    return this.page.locator('//td').describe('Table cells')
  }

}
