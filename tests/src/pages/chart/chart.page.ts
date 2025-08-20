import test, { expect, Page } from '@playwright/test'
import { BasePage } from '../../base/page'
import { ChartPageLocators } from './chart.locators'
import { findColorCoordinates } from '../../utils/color'

export class ChartPage extends BasePage {
  readonly locators = new ChartPageLocators(this.page)

  constructor(page: Page){
    super(page, '/chart')
  }

  async waitPageIsReady(): Promise<void> {
    await expect(this.locators.chart()).toBeVisible()
  }

  private getItemColor(name: string): Promise<string> {
    return test.step(`Get "${name}" legend item color`, ()=> {
      return this.locators.legendItem()
        .filter({hasText: name})
        .evaluate((element) => {
          const styles = window.getComputedStyle(element)
          return styles.color
        })
    })
  }

  private async getItemCoordinates(name: string): Promise<{ x: number; y: number } | null> {
    const targetColorRgb = await this.getItemColor(name)
    return findColorCoordinates({
      targetColorRgb,
      locator: this.locators.chart()
    })
  }

  async hoverOverItem(name: string): Promise<void> {
    await test.step(`Hover over "${name}" on the chart`, async ()=> {
      const coords = await this.getItemCoordinates(name)
      expect(
        coords,
        `To find ${name} coordinates`
      ).not.toBeNull()
      await this.page.mouse.move(coords!.x, coords!.y)
    })
  }

  async openItemContextMenu(name: string): Promise<void> {
    await test.step(`Open "${name}" item's context menu on the chart`, async ()=> {
      const coords = await this.getItemCoordinates(name)
      expect(
        coords,
        `To find ${name} coordinates`
      ).not.toBeNull()
      await this.page.mouse.click(coords!.x, coords!.y, { button: 'right'})
    })
  }

  async validateItemIsVisible(name: string) {
    await expect.poll(
      ()=> this.getItemCoordinates(name),
      `${name} to be displayed on the chart`
    ).not.toBeNull()
  }

  async validateItemIsHidden(name: string) {
    await expect.poll(
      ()=> this.getItemCoordinates(name),
      `${name} not to be displayed on the chart`
    ).toBeNull()
  }
  
}