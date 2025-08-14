import { Page } from '@playwright/test'
import { TableLocators } from './table.locators'
import { Component } from '../component'
import { ColumnSortFeature } from './features/sort'

export class TableComponent extends Component {
  readonly locators: TableLocators
  readonly sort: ColumnSortFeature
  // Add more table features bellow

  constructor(page: Page, options?: { locators?: TableLocators }) {
    super(page)
    const {
      locators
    } = options ?? {}
    this.locators = locators ?? new TableLocators(page)
    this.sort = new ColumnSortFeature(page, options)
  }

}