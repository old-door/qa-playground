import { test as base } from '@playwright/test'
import { SortingDemoPage } from '../pages/sorting-demo/sorting-demo.page'

type PagesFixtures = {
  sortableTablePage: SortingDemoPage
}

export const test = base.extend<PagesFixtures>({
  sortableTablePage: async ({ page }, use) => {
    const sortableTablePage = new SortingDemoPage(page)
    await sortableTablePage.open()
    await use(sortableTablePage)
  },
})
