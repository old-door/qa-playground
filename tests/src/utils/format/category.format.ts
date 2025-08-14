import { Format } from './types'
import { comparing } from '../comparator'
import { expect } from '@playwright/test'

export class CategoryFormat implements Format<string> {

  readonly comparator = comparing(this.parser.bind(this))
  readonly map = new Map<string, string>([
    ['🍎', 'A'],
    ['🚀', 'B'],
    ['🎯', 'C'],
  ])
  
  parser(value: string): string {
    const result = this.map.get(value)
    expect(result,
      `${value} -> ${result} successfully mapped`
    ).toBeDefined()
    return result!
  }
}