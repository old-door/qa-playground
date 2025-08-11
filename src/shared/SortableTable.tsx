import { useMemo, useState } from 'react'
import dayjs from 'dayjs'

type Row = {
  id: number
  name: string
  price: number
  inStock: boolean
  addedDate: string // ISO date string
  category: string // will display emoji
}

const categoryEmojiMap: Record<string, string> = {
  A: '🍎', // Apple
  B: '🚀', // Rocket
  C: '🎯' // Target
}

const ROWS: Row[] = [
  { id: 1, name: 'Alpha', price: 12.5, inStock: true, addedDate: '2024-01-10', category: 'A' },
  { id: 2, name: 'Bravo', price: 7.0, inStock: false, addedDate: '2023-12-05', category: 'B' },
  { id: 3, name: 'Charlie', price: 19.99, inStock: true, addedDate: '2024-06-01', category: 'A' },
  { id: 4, name: 'Delta', price: 3.5, inStock: false, addedDate: '2022-11-20', category: 'C' },
  { id: 5, name: 'Echo', price: 100, inStock: true, addedDate: '2024-07-15', category: 'B' }
]

const COLUMNS: { key: keyof Row; label: string; type: 'number' | 'string' | 'boolean' | 'date'}[] = [
  { key: 'id', label: 'ID', type: 'number' },
  { key: 'name', label: 'Name', type: 'string' },
  { key: 'price', label: 'Price', type: 'number' },
  { key: 'inStock', label: 'In Stock', type: 'boolean' },
  { key: 'addedDate', label: 'Added Date', type: 'date' },
  { key: 'category', label: 'Category', type: 'string' }
]

export default function SortableTable() {
  const [rows] = useState<Row[]>(ROWS)
  const [sortKey, setSortKey] = useState<keyof Row | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  function onHeaderClick(key: keyof Row) {
    if (sortKey === key) {
      // Click 1: asc → desc
      if (sortDir === 'asc') {
        setSortDir('desc')
      }
      // Click 2: desc → none (reset default sort)
      else if (sortDir === 'desc') {
        setSortKey(null)
        setSortDir('asc')
      }
    } else {
      // First click on a different column → asc
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sorted = useMemo(() => {
    if (!sortKey) return rows
    const colDef = COLUMNS.find((c) => c.key === sortKey)!
    const copy = [...rows]
    copy.sort((a, b) => {
      const av = a[sortKey]
      const bv = b[sortKey]

      let cmp = 0
      if (colDef.type === 'number') {
        cmp = Number(av) - Number(bv)
      } else if (colDef.type === 'date') {
        cmp = new Date(String(av)).getTime() - new Date(String(bv)).getTime()
      } else if (colDef.type === 'boolean') {
        cmp = av === bv ? 0 : av ? -1 : 1
      } else {
        cmp = String(av).localeCompare(String(bv))
      }

      return sortDir === 'asc' ? cmp : -cmp
    })
    return copy
  }, [rows, sortKey, sortDir])

  return (
    <table data-testid="sortable-table" style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          {COLUMNS.map((col) => (
            <th
              key={String(col.key)}
              onClick={() => onHeaderClick(col.key)}
              data-testid={`col-${String(col.key)}`}
              style={{ cursor: 'pointer', textAlign: 'left', padding: '6px 12px' }}
              aria-sort={sortKey === col.key ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
            >
              {col.label} {sortKey === col.key ? (sortDir === 'asc' ? '▲' : '▼') : ''}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {sorted.map((r, idx) => (
          <tr key={r.id} data-testid={`row-${idx}`}>
            <td style={{ padding: '6px 12px' }}>{r.id}</td>
            <td style={{ padding: '6px 12px' }}>{r.name}</td>
            <td style={{ padding: '6px 12px' }}>{'$' + r.price}</td>
            <td style={{ padding: '6px 12px' }}>{String(r.inStock)}</td>
            <td style={{ padding: '6px 12px' }}>
              {dayjs(r.addedDate).format('DD MMM YYYY')}
            </td>
            <td style={{ padding: '6px 12px' }}>
              {categoryEmojiMap[r.category] || r.category}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
