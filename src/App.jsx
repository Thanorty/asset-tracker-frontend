import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'

import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'

const LoginPage = lazy(() => import('./pages/LoginPage'))
const SignUpPage = lazy(() => import('./pages/SignUpPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const PortfolioPage = lazy(() => import('./pages/PortfolioPage'))
const ExpensesPage = lazy(() => import('./pages/ExpensesPage'))
const SalaryPage = lazy(() => import('./pages/SalaryPage'))
const UserManagementPage = lazy(() => import('./pages/UserManagementPage'))

function PageLoader() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
      <CircularProgress />
    </Box>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/salary" element={<SalaryPage />} />
              <Route path="/admin/users" element={<UserManagementPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
