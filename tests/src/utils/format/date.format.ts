import { expect } from '@playwright/test'
import { Format } from './types'
import { comparing } from '../comparator'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import utc from 'dayjs/plugin/utc.js'

dayjs.extend(utc)
dayjs.extend(customParseFormat)

export class DateFormat implements Format<Date> {

  constructor(readonly dateFormat: string){}

  readonly comparator = comparing(this.parser.bind(this))
  
  parser(value: string, options?: { format?: string | string[], locale?: string}): Date {
    const { format = this.dateFormat, locale = 'en' } = options ?? {}
    const parsed = dayjs(value, format, locale, true)
    expect(parsed.isValid(), `Value: ${value} to be parsed as date format`).toBeTruthy()
    return parsed.toDate()
  }
}