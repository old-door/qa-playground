import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import TablePage from './pages/TablePage'
import Items from './pages/Items'
import './index.css'
import React from 'react'
import ChartPage from './pages/ChartPage'

const navItems = [
  { to: '/', label: 'Home', testId: 'nav-home' },
  { to: '/table', label: 'Table', testId: 'nav-table' },
  { to: '/items', label: 'Items', testId: 'nav-items' },
  { to: '/chart', label: 'Chart', testId: 'nav-paint' },
]

export default function App() {
  return (
    <div>
      <nav style={{ padding: 12 }}>
        {navItems.map((item, index) => (
          <React.Fragment key={item.to}>
            {index > 0 && ' | '}
            <NavLink
              to={item.to}
              data-testid={item.testId}
              style={({ isActive }) => ({
                textDecoration: isActive ? 'underline' : 'none',
              })}
            >
              {item.label}
            </NavLink>
          </React.Fragment>
        ))}
      </nav>

      <main style={{ padding: 12 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/table" element={<TablePage />} />
          <Route path="/items" element={<Items />} />
          <Route path="/chart" element={<ChartPage />} />
        </Routes>
      </main>
    </div>
  )
}