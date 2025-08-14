import { TableColumn } from '../../base/table'
import { Formats } from '../../utils/format'

export const SORTABLE_TABLE_COLUMNS = {
  id: new TableColumn(
    {
      name: 'ID',
      format: Formats.NUMBER,
    }
  ),
  name: new TableColumn(
    {
      name: 'Name',
      format: Formats.STRING,
    }
  ),
  price: new TableColumn(
    {
      name: 'Price',
      format: Formats.PRICE,
    }
  ),
  inStock: new TableColumn(
    {
      name: 'In Stock',
      format: Formats.BOOLEAN,
    }
  ),
  addedDate: new TableColumn(
    {
      name: 'Added Date',
      format: Formats.DATE,
    }
  ),
  category: new TableColumn(
    {
      name: 'Category',
      format: Formats.CATEGORY,
    }
  )
}