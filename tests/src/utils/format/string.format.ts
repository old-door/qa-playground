import { Format } from './types'

export class StringFormat implements Format<string> {

  comparator(a: string, b: string): number {
    return a.localeCompare(b)
  }

  // No parser need for string. Do nothing
  parser(value: string) {
    return value
  }
}