import { expect } from '@playwright/test'
import { FilterConfig, ItemsFilters } from './types'

export function getFilterConfig(type: ItemsFilters): FilterConfig{
  expect(filterConfigs[type], `To find filter config for: ${type}`).toBeDefined()
  return filterConfigs[type]
}

const filterConfigs: Record<ItemsFilters, FilterConfig> = {

  [ItemsFilters.ONLY_DISCOUNT]: {
    apply: async (locators, value) => {
      if (typeof value !== 'boolean') {
        throw new Error(`Filter ${ItemsFilters.ONLY_DISCOUNT} requires boolean value, but got: ${value}`)
      }
      if (value) {
        await locators.onlyDiscountCheckboxFilter().check()
      } else {
        await locators.onlyDiscountCheckboxFilter().uncheck()
      }
    },
    validate: (value, item) => {
      if (typeof value !== 'boolean') {
        throw new Error(`Filter ${ItemsFilters.ONLY_DISCOUNT} requires boolean value, but got: ${value}`)
      }
      if (value) {
        expect.soft(item.originalPrice, `${item.name} to have a discount`).toBeDefined()
      }
    },
    defaultValidate: async (locators) => {
      await expect(locators.onlyDiscountCheckboxFilter(), `Only discount checkbox to be unchecked`).not.toBeChecked()
    },
  },

  [ItemsFilters.MIN_PRICE]: {
    apply: async (locators, value) => {
      await locators.minPriceInputFilter().fill(String(value))
    },
    validate: (value, item) => {
      expect.soft(item.price, `${item.name} price to be >= ${value}`).toBeGreaterThanOrEqual(parseInt(String(value)))
    },
    defaultValidate: async (locators) => {
      await expect(locators.minPriceInputFilter(), `Min price to be 0`).toHaveValue('0')
    },
  },

  [ItemsFilters.MAX_PRICE]: {
    apply: async (locators, value) => {
      await locators.maxPriceInputFilter().fill(String(value))
    },
    validate: (value, item) => {
      expect.soft(item.price, `${item.name} price to be <= ${value}`).toBeLessThanOrEqual(parseInt(String(value)))
    },
    defaultValidate: async (locators, items) => {
      const sortedByPriceItems = [...items].sort((a, b) => a.price - b.price).reverse()
      const maxPrice = sortedByPriceItems[0].originalPrice ?? sortedByPriceItems[0].price
      await expect(locators.maxPriceInputFilter(), `Max price to be ${maxPrice}`).toHaveValue(String(maxPrice))
    },
  },

  [ItemsFilters.TYPE]: {
    apply: async (locators, value) => {
      if (Array.isArray(value) && value.length >= 1) {
        for (const v of value) {
          await locators.typeCheckboxFilter(v).check()
        }
      } else {
        throw new Error(`Filter ${ItemsFilters.TYPE} requires strings array, but got: ${value}`)
      }
    },
    validate: (value, item) => {
      if (Array.isArray(value) && value.length >= 1) {
        expect.soft(value.some(v => v === item.type), `${item.name} type to be in [${value}]`).toBeTruthy()
      } else {
        throw new Error(`Filter ${ItemsFilters.TYPE} requires strings array, but got: ${value}`)
      }
    },
    defaultValidate: async (locators, items) => {
      const types = new Set(items.map(t => t.type))
      expect(types.size, 'Unique items type count to be at least 1').toBeGreaterThanOrEqual(1)
      for (const type of types) {
        await expect(locators.typeCheckboxFilter(type), `Type ${type} to be unchecked`).not.toBeChecked()
      }
    },
  },
  
}