import { expect } from '@playwright/test'
import { test } from '../src/fixtures'

test.describe('Chart', () => {
  const defaultItem = 'Item1'
  const allItems = [defaultItem, 'Item2', 'Item3']

  test(`Default state`, async ({ chartPage }) => {
    await chartPage.validateItemIsVisible(defaultItem)
    await expect(chartPage.locators.chart()).toHaveScreenshot('default.png')
  })

  test(`All items are displayed`, async ({ chartPage }) => {
    for (const item of allItems) {
      await chartPage.locators.legendItemCheckbox(item).check()
      await chartPage.validateItemIsVisible(item)
    }
    await expect(chartPage.locators.chart()).toHaveScreenshot('all-displayed.png')
  })

  test(`All except default items are displayed. Disable via context menu`, async ({ chartPage }) => {
    for (const item of allItems) {
      await chartPage.locators.legendItemCheckbox(item).check()
      await chartPage.validateItemIsVisible(item)
    }
    await chartPage.openItemContextMenu(defaultItem)
    await chartPage.locators.hideItemContexMenuOption().click()
    await chartPage.validateItemIsHidden(defaultItem)
    await expect(chartPage.locators.chart()).toHaveScreenshot('all-except-default-displayed.png')
  })

  test(`All except default items are displayed. Disable via checkbox`, async ({ chartPage }) => {
    for (const item of allItems.filter(name => name !== defaultItem)) {
      await chartPage.locators.legendItemCheckbox(item).check()
      await chartPage.validateItemIsVisible(item)
    }
    await chartPage.locators.legendItemCheckbox(defaultItem).uncheck()
    await chartPage.validateItemIsHidden(defaultItem)
    await expect(chartPage.locators.chart()).toHaveScreenshot('all-except-default-displayed.png')
  })

  test(`Default. Tooltip is displayed`, async ({ chartPage }) => {
    await chartPage.validateItemIsVisible(defaultItem)
    await chartPage.hoverOverItem(defaultItem)
    await expect(
      chartPage.locators.tooltip(),
      'Tooltip to be visible'
    ).toBeVisible()
    await expect(
      chartPage.locators.tooltip(),
      `Tooltip to contain text: ${defaultItem}`
    ).toContainText(defaultItem)
    await expect(chartPage.locators.chart()).toHaveScreenshot('tooltip.png')
  })

  test(`All items are displayed. Validate tooltip`, async ({ chartPage }) => {
    for (const item of allItems) {
      await chartPage.locators.legendItemCheckbox(item).check()
      await chartPage.validateItemIsVisible(item)
    }
    const name = 'Item2'
    await chartPage.hoverOverItem(name)
    await expect(
      chartPage.locators.tooltip(),
      'Tooltip to be visible'
    ).toBeVisible()
    await expect(
      chartPage.locators.tooltip(),
      `Tooltip to contain text: ${name}`
    ).toContainText(name)
    await expect(chartPage.locators.chart()).toHaveScreenshot('all-items-on-the-chart-item2-tooltip.png')
  })

  test.describe('Empty state', () => {
    const screenshotName = 'empty.png'

    test(`Disable 1 item via context menu`, async ({ chartPage }) => {
      await chartPage.validateItemIsVisible(defaultItem)
      await chartPage.openItemContextMenu(defaultItem)
      await chartPage.locators.hideItemContexMenuOption().click()
      await chartPage.validateItemIsHidden(defaultItem)
      await expect(chartPage.locators.chart()).toHaveScreenshot(screenshotName)
    })

    test(`Disable all items via context menu`, async ({ chartPage }) => {
      for (const item of allItems) {
        await chartPage.locators.legendItemCheckbox(item).check()
        await chartPage.validateItemIsVisible(item)
        await chartPage.openItemContextMenu(item)
        await chartPage.locators.hideItemContexMenuOption().click()
        await chartPage.validateItemIsHidden(item)
      }
      await expect(chartPage.locators.chart()).toHaveScreenshot(screenshotName)
    })

    test(`Disable all items via legend items checkbox`, async ({ chartPage }) => {
      for (const item of allItems) {
        await chartPage.locators.legendItemCheckbox(item).uncheck()
        await chartPage.validateItemIsHidden(item)
      }
      await expect(chartPage.locators.chart()).toHaveScreenshot(screenshotName)
    })

  })

})