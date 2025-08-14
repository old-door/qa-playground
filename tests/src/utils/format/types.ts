import { Comparator } from '../comparator'

export interface Format<T = unknown> {
  comparator: Comparator
  parser: (value: string) => T
}