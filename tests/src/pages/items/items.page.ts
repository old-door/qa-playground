import test, { expect, Page } from '@playwright/test'
import { BasePage } from '../../base/page'
import { ItemsPageLocators } from './items.locators'
import { FilterOptions, Item, ItemsFilters } from './types'
import { Formats } from '../../utils/format'

export class ItemsPage extends BasePage {
  readonly locators = new ItemsPageLocators(this.page)

  constructor(page: Page){
    super(page, '/items')
  }

  async waitPageIsReady(): Promise<void> {
    await expect(this.locators.itemCard().first()).toBeVisible()
  }

  getItems(): Promise<Item[]>{
    return test.step('Get items', async ()=> {
      const arr: Item[] = []
      for (const [i, item] of (await this.locators.itemCard().all()).entries()) {
        await test.step(`Item #${i+1}`, async ()=> {
          const obj = {
            name: (await item.locator(this.locators.itemName()).textContent())!,
            type: (await item.locator(this.locators.itemType()).textContent())!,
            price: Formats.PRICE.parser((await item.locator(this.locators.itemPrice()).textContent())!),
            originalPrice: await item.locator(this.locators.itemOriginalPrice()).isVisible() 
              ? Formats.PRICE.parser((await item.locator(this.locators.itemOriginalPrice()).textContent())!)
              : undefined
          }
          expect(obj, `Item #${i+1} ${obj.name} to be parsed successfully`).toEqual(
            {
              name: expect.any(String),
              type: expect.any(String),
              price: expect.any(Number),
              originalPrice: obj.originalPrice ? expect.any(Number) : undefined
            }
          )
          arr.push(obj)
        })
      }
      return arr
    })
  }

  async filter(options: FilterOptions | FilterOptions[]){
    for (const { type, value} of Array.isArray(options) ? options : [options]) {
      await test.step(`Filter by ${type}: ${value}`, async ()=> {
        switch (type) {
          case ItemsFilters.ONLY_DISCOUNT:
            if (typeof value === 'boolean') {
              if (value) {
                await this.locators.onlyDiscountCheckboxFilter().check()
              } else {
                await this.locators.onlyDiscountCheckboxFilter().uncheck()
              }
            } else {
              throw new Error(
                `Filter ${ItemsFilters.ONLY_DISCOUNT} requires boolean value type, but got value: ${value}`
              )
            }
            break
          case ItemsFilters.MIN_PRICE:
            await this.locators.minPriceInputFilter().fill(String(value))
            break
          case ItemsFilters.MAX_PRICE:
            await this.locators.maxPriceInputFilter().fill(String(value))
            break
          case ItemsFilters.TYPE:
            if (Array.isArray(value)) {
              expect(
                value.length,
                `Values array to have at least 1 item`
              ).toBeGreaterThanOrEqual(1)
              for (const v of value) {
                await this.locators.typeCheckboxFilter(String(v)).check()
              }
            } else {
              throw new Error(
                `Filter ${ItemsFilters.TYPE} requires strings array value type, but got value: ${value}`
              )
            }
            
            break
          default:
            throw new Error(`Unknown filter type: ${type}`)
        }
      })
    }
  }

  async validate(options: FilterOptions | FilterOptions[]) {
    const items = await this.getItems()
    expect(
      items.length,
      `To have at least 1 filtered item`
    ).toBeGreaterThanOrEqual(1)
    for (const { type, value} of Array.isArray(options) ? options : [options]) {
      await test.step(`Validate filter by ${type}: ${value}`, () => {
        let validate: (item: Item) => void
        switch (type) {
          case ItemsFilters.ONLY_DISCOUNT:
            if (typeof value === 'boolean') {
              if (value) {
                validate = (item: Item) => expect.soft(
                  item.originalPrice, 
                  `${item.name} to have a dicsount`
                ).toBeDefined()
              } else {
                validate = (item: Item) => expect.soft(
                  item.originalPrice === undefined || item.originalPrice !== undefined,
                  `${item.name} to have or not to have a dicsount`
                ).toBeTruthy()
              }
            } else {
              throw new Error(
                `Type ${ItemsFilters.ONLY_DISCOUNT} requires boolean value type, but got value: ${value}`
              )
            }
            break
          case ItemsFilters.MIN_PRICE:
            validate = (item: Item) => expect.soft(
              item.price, 
              `${item.name} price to be greater than or equal ${value}`
            ).toBeGreaterThanOrEqual(parseInt(String(value)))
            break
          case ItemsFilters.MAX_PRICE:
            validate = (item: Item) => expect.soft(
              item.price, 
              `${item.name} price to be less than or equal ${value}`
            ).toBeLessThanOrEqual(parseInt(String(value)))
            break
          case ItemsFilters.TYPE:
            if (Array.isArray(value)) {
              expect(
                value.length,
                `Values array to have at least 1 item`
              ).toBeGreaterThanOrEqual(1)
              validate = (item: Item) => expect.soft(
                value.some( v => v === item.type), 
                `${item.name} type to be included in [${value}]`
              ).toBeTruthy()
            } else {
              throw new Error(
                `Filter ${ItemsFilters.TYPE} requires strings array value type, but got value: ${value}`
              )
            }
            break
          default:
            throw new Error(`Unknown filter type: ${type}`)
        }
        
        for (const item of items) {
          validate(item)
        }
      })
    }
  }

  async validateFilterDefaultState(){
    await test.step(`Validate all filter inputs default state`, async ()=> {
      const items = await this.getItems()
      const sortedByPriceItems = [...items].sort((a, b) => a.price - b.price).reverse()
      const maxPrice = sortedByPriceItems[0].originalPrice ?? sortedByPriceItems[0].price
      const types = new Set(items.map(t => t.type))

      await expect(this.locators.onlyDiscountCheckboxFilter()).not.toBeChecked()
      await expect(
        this.locators.minPriceInputFilter(),
        `Min price to be 0`
      ).toHaveValue('0')
      await expect(
        this.locators.maxPriceInputFilter(),
        `Max price to be ${maxPrice}`
      ).toHaveValue(String(maxPrice))
      for (const type of types) {
        await expect(this.locators.typeCheckboxFilter(type)).not.toBeChecked()
      }
    })
  }

}