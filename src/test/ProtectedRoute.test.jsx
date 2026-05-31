import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import { AuthContext } from '../context/auth-context'
function renderWithAuth(isAuthenticated) {
  const value = {
    token: isAuthenticated ? 'fake-token' : null,
    user: null,
    isAuthenticated,
    login: vi.fn(),
    logout: vi.fn(),
  }
  return render(
    <AuthContext.Provider value={value}>
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<div>Protected Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  )
}
describe('ProtectedRoute', () => {
  it('renders child route when authenticated', () => {
    renderWithAuth(true)
    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })
  it('redirects to login when not authenticated', () => {
    renderWithAuth(false)
    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })
})
