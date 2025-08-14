import { Format } from '../../utils/format'

export class TableColumn {
  readonly isSortable: boolean
  readonly name: string 
  readonly format: Format 

  constructor(
    options: {
      name: string
      format: Format
      isSortable?: boolean
    }
  ) {
    const {
      name,
      format,
      isSortable = true,
    } = options ?? {}
    this.name = name
    this.format = format
    this.isSortable = isSortable
  }
  
  toString() {
    return this.name
  }
}
