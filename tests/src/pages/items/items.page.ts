import test, { expect, Page } from '@playwright/test'
import { BasePage } from '../../base/page'
import { ItemsPageLocators } from './items.locators'
import { FilterOptions, Item, ItemsFilters } from './types'
import { Formats } from '../../utils/format'
import { getFilterConfig } from './filter-configs'

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
        await getFilterConfig(type).apply(this.locators, value)
      })
    }
  }

  async validate(options: FilterOptions | FilterOptions[]) {
    const items = await this.getItems()
    expect(
      items.length,
      `To have at least 1 filtered item`
    ).toBeGreaterThanOrEqual(1)
    for (const { type, value } of Array.isArray(options) ? options : [options]) {
      await test.step(`Validate filter by ${type}: ${value}`, async () => {
        const validate = getFilterConfig(type).validate
        for (const item of items) {
          await validate(value, item)
        }
      })
    }
  }

  async validateFilterDefaultState(){
    await test.step(`Validate all filter inputs default state`, async ()=> {
      const items = await this.getItems()
      for (const type of Object.values(ItemsFilters)) {
        await test.step(`Validate default state for ${type}`, async () => {
          await getFilterConfig(type).defaultValidate(this.locators, items)
        })
      }
    })
  }

}