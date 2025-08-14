import { expect, Locator, test } from '@playwright/test'
import { TableColumn } from '../column'
import { SortingDirection } from '../types'
import { BaseTableFeature } from './base'

export class ColumnSortFeature extends BaseTableFeature {

  async apply(
    column: TableColumn | string,
    options?: Parameters<Locator['click']>[0],
  ): Promise<void> {
    const { clickCount = 1 } = options ?? {}
    // Wrap with step for clarity in the report
    await test.step(`Apply sorting by clicking on the column ${column} header; Click count: ${clickCount}`, async () => {
      await this.locators.headerByColumn(column).click(options)
    })
  }
  
  async validate(
    column: TableColumn,
    direction: SortingDirection
  ): Promise<void> {
    await test.step(
      `Validate table column "${column}" is sorted in "${direction}" direction`, 
      async () => {
        await expect(
          this.locators.headerByColumn(column)
        ).toHaveAttribute('aria-sort', direction)

        if (direction !== 'none') {
          const values = await this.getColumnValues(column)
          expect(
            new Set(values).size,
            `To have at least 2 unique values`
          ).toBeGreaterThanOrEqual(2)
          for (let i = 1; i < values.length; i++) {
            await test.step(`Compare row #${i} and #${i + 1}`, async () => {
              const value = values[i - 1]
              const nextValue = values[i]
              const result = await test.step(`Parse and compare values`, () => {
                return column.format.comparator(value, nextValue)
              })
  
              switch (direction) {
                case 'ascending':
                  expect.soft(
                    result,
                    `#${i} ${value} to be less than or equal #${
                      i + 1
                    } ${nextValue}`
                  ).toBeLessThanOrEqual(0)
                  break
  
                case 'descending':
                  expect.soft(
                    result,
                    `#${i} ${value} to be greater than or equal #${
                      i + 1
                    } ${nextValue}`
                  ).toBeGreaterThanOrEqual(0)
                  break
  
                default:
                  throw new Error(`Unknown sorting direction: ${String(direction)}`)
              }
            })
          }
        }
      })
  }
  
  async validateAscending(
    column: TableColumn,
  ): Promise<void> {
    await this.validate(column, 'ascending')
  }
  
  async validateDescending(
    column: TableColumn,
  ): Promise<void> {
    await this.validate(column, 'descending')
  }

  async validateNone(
    column: TableColumn,
  ): Promise<void> {
    await this.validate(column, 'none')
  }
}
