import { Page } from '@playwright/test'
import { Locators } from './locators'

export abstract class Component {

  abstract readonly locators: Locators

  protected constructor(protected readonly page: Page) {
  }

}