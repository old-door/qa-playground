import { test as base } from '@playwright/test'
import { SortingDemoPage } from '../pages/sorting-demo/sorting-demo.page'
import { ItemsPage } from '../pages/items/items.page'
import { ChartPage } from '../pages/chart/chart.page'

type PagesFixtures = {
  sortableTablePage: SortingDemoPage
  itemsPage: ItemsPage
  chartPage: ChartPage
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

  chartPage: async ({ page }, use) => {
    const chartPage = new ChartPage(page)
    await chartPage.open()
    await use(chartPage)
  },
})
