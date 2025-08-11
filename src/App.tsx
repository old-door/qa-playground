import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import TablePage from './pages/TablePage'

export default function App() {
  return (
    <div>
      <nav style={{ padding: 12 }}>
        <Link to="/" data-testid="nav-home">Home</Link>
        {' '}|{' '}
        <Link to="/table" data-testid="nav-table">Table</Link>
      </nav>

      <main style={{ padding: 12 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/table" element={<TablePage />} />
        </Routes>
      </main>
    </div>
  )
}