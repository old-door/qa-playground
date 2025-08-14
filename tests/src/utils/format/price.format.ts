import { expect } from '@playwright/test'
import { Format } from './types'
import { NumberFormat } from './number.format'

export class PriceFormat extends NumberFormat implements Format<number> {
  
  parser(value: string): number {
    const regex = /^\$\d+(?:\.\d{1,2})?$/ // Matching examples: $5, $123, $12.3, $12.34
    expect(value, `${value} match currency format`).toMatch(regex)
    return super.parser(value.replace('$', ''))
  }
}