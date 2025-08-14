import { mergeTests } from '@playwright/test'
import { test as pagesFixtures } from './pages.fixtures'

export const test = mergeTests(
  pagesFixtures,
  // Add more fixters here 
)
