import { BrowserRouter, Routes, Route } from 'react-router-dom'
import DashboardPage from './pages/DashboardPage'
import PortfolioPage from './pages/PortfolioPage'
import ExpensesPage from './pages/ExpensesPage'

import MainLayout from './layouts/MainLayout'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/expenses" element={<ExpensesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
