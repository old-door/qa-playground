import { Locators } from '../../base/locators'

export class ChartPageLocators extends Locators {

  chart(){
    return this.page.locator('//canvas').describe('Chart')
  }

  legendItem(){
    return this.page.getByTestId('legend-item').describe('Legend item')
  }

  legendItemCheckbox(name: string){
    return this.page.getByTestId('legend-item')
      .filter({hasText: name})
      .locator('//input')
      .describe(`Legend item ${name} checkbox`)
  }

  hideItemContexMenuOption(){
    return this.page.getByTestId('chart-item-context-menu-hide-item').describe('Hide item cotext menu option')
  }

  tooltip(){
    return this.page.getByTestId('tooltip').describe('tooltip')
  }

}