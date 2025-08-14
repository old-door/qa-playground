import { Format } from './types'

export class BooleanFormat implements Format<boolean> {

  comparator(a: string, b: string) {
    const keyA = this.parser(a)
    const keyB = this.parser(b)
    // same = equal, true < false
    return keyA === keyB ? 0 : keyA ? -1 : 1
  }
  
  parser(value: string): boolean {
    return value.toLowerCase() === 'true'
  }
}