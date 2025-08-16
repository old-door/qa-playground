import { expect } from '@playwright/test'
import { test } from '../src/fixtures'
import { FilterOptions, ItemsFilters } from '../src/pages/items/types'

test.describe('Filterable items', () => {

  const filters: FilterOptions[] = [
    {
      type: ItemsFilters.MIN_PRICE,
      value: 50
    },
    {
      type: ItemsFilters.MAX_PRICE,
      value: 500
    },
    {
      type: ItemsFilters.ONLY_DISCOUNT,
      value: true
    },
    {
      type: ItemsFilters.TYPE,
      value: ['Clothing']
    },
    {
      type: ItemsFilters.TYPE,
      value: ['Clothing', 'Electronics']
    },
  ]
  for (const filter of filters) {
    test(`Single filter › ${filter.type}: ${filter.value}`, async ({ itemsPage }) => {
      await itemsPage.filter(filter)
      await itemsPage.validate(filter)
    })
  }

  test(`Multiple filters`, async ({ itemsPage }) => {
    await itemsPage.filter(filters)
    await itemsPage.validate(filters)
  })

  test(`Reset filters`, async ({ itemsPage }) => {
    const before = await itemsPage.getItems()
    await itemsPage.filter(filters)
    await itemsPage.locators.resetFiltersButton().click()
    await itemsPage.validateFilterDefaultState()
    const after = await itemsPage.getItems()
    expect(after,
      'Items array before filtering and after reset filters to be equal'
    ).toEqual(before)
  })

  test(`Filters default state`, async ({ itemsPage }) => {
    await itemsPage.validateFilterDefaultState()
  })

  test(`Nothing found`, async ({ itemsPage }) => {
    const filters: FilterOptions[] = [
      {
        type: ItemsFilters.MIN_PRICE,
        value: 300
      },
      {
        type: ItemsFilters.TYPE,
        value: ['Home']
      }
    ]
    await itemsPage.filter(filters)
    await expect(itemsPage.locators.itemCard()).toHaveCount(0)
  })

})