import { test, expect } from '@playwright/test'

test('home page and navigation', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('[data-testid="home-page"]')).toBeVisible()
  await expect(page.locator('text=QA Playground')).toBeVisible()
  await page.click('[data-testid="nav-table"]')
  await expect(page).toHaveURL('/table')
  await expect(page.locator('[data-testid="table-page"]')).toBeVisible()
})