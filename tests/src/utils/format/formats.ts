import { BooleanFormat } from './boolean.format'
import { CategoryFormat } from './category.format'
import { DateFormat } from './date.format'
import { NumberFormat } from './number.format'
import { PriceFormat } from './price.format'
import { StringFormat } from './string.format'

export const Formats = {
  BOOLEAN: new BooleanFormat(),
  CATEGORY: new CategoryFormat(),
  DATE: new DateFormat('DD MMM YYYY'),
  NUMBER: new NumberFormat(),
  PRICE: new PriceFormat(),
  STRING: new StringFormat()
}