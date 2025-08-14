import { Page } from '@playwright/test'

export abstract class Locators {
  constructor(protected readonly page: Page) {}
}
