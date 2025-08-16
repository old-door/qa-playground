import { Locators } from '../../base/locators'

export class ItemsPageLocators extends Locators {

  // Item card locator
  itemCard(){
    return this.page.getByTestId('item-card').describe('Item card')
  }

  itemPrice(){
    return this.page.getByTestId('item-price').describe('Item price')
  }

  itemOriginalPrice(){
    return this.page.getByTestId('item-original-price').describe('Item original price')
  }
  
  itemType(){
    return this.page.getByTestId('item-type').describe('Item type')
  }

  itemName(){
    return this.page.getByTestId('item-name').describe('Item name')
  }

  // Filter locators
  onlyDiscountCheckboxFilter(){
    return this.page.locator(`//input[@name="only-discount"]`).describe('Only discount checkbox')
  }

  minPriceInputFilter(){
    return this.page.locator(`//input[@name="min-price"]`).describe('Min price filter input')
  }

  maxPriceInputFilter(){
    return this.page.locator(`//input[@name="max-price"]`).describe('Max price filter input')
  }

  typeCheckboxFilter(type: string){
    return this.page
      .locator(`//input[@type="checkbox" and @name='include-${type.toLowerCase()}']`)
      .describe(`Include type ${type} checkbox`)
  }

  resetFiltersButton(){
    return this.page.getByTestId(`reset-filters`).describe('Reset filters button')
  }

}