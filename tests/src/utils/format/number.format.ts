import { expect } from '@playwright/test'
import { Format } from './types'
import { comparing } from '../comparator'

export class NumberFormat implements Format<number> {

  readonly comparator = comparing(this.parser.bind(this))
  
  parser(value: string): number {
    const number = parseFloat(value)
    expect(number, `${number} is not NaN`).not.toBeNaN()
    return number
  }
}