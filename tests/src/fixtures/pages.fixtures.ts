import { test as base } from '@playwright/test'
import { SortingDemoPage } from '../pages/sorting-demo/sorting-demo.page'
import { ItemsPage } from '../pages/items/items.page'

type PagesFixtures = {
  sortableTablePage: SortingDemoPage
  itemsPage: ItemsPage
}

export const test = base.extend<PagesFixtures>({
  sortableTablePage: async ({ page }, use) => {
    const sortableTablePage = new SortingDemoPage(page)
    await sortableTablePage.open()
    await use(sortableTablePage)
  },

  itemsPage: async ({ page }, use) => {
    const itemsPage = new ItemsPage(page)
    await itemsPage.open()
    await use(itemsPage)
  },
})
