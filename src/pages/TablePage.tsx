import SortableTable from '../shared/SortableTable'

export default function TablePage() {
  return (
    <div data-testid="table-page">
      <h1>Sortable Table</h1>
      <p>Click on the column headers to sort by that column.</p>
      <SortableTable />
    </div>
  )
}