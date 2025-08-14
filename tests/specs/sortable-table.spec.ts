import { test } from '../src/fixtures'
import { SORTABLE_TABLE_COLUMNS } from '../src/pages/sorting-demo/sorting-demo.columns'

test.describe('Sortable table', () => {

  for (const column of Object.values(SORTABLE_TABLE_COLUMNS)) {
    
    test(`${column} sort ascending`, async ({ sortableTablePage }) => {
      const table = sortableTablePage.table
      await table.sort.validateNone(column)
      await table.sort.apply(column)
      await table.sort.validateAscending(column)
    })

    test(`${column} sort descending`, async ({ sortableTablePage }) => {
      const table = sortableTablePage.table
      await table.sort.validateNone(column)
      await table.sort.apply(column, { clickCount: 2})
      await table.sort.validateDescending(column)
    })

  }

})