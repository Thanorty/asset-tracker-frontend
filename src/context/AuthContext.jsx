import { useCallback, useMemo, useState } from 'react'
import { loginUser } from '../api/authApi'
import { AuthContext } from './auth-context'

function normalizeLoginPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return { token: null, user: null }
  }

  return {
    token: payload.token ?? payload.accessToken ?? null,
    user: payload.user ?? null,
  }
}

function isTokenExpired(token) {
  if (!token) return true

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))

    if (!payload.exp) return false

    return payload.exp * 1000 < Date.now()
  } catch {
    return false
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const stored = localStorage.getItem('authToken')

    if (stored && isTokenExpired(stored)) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('authUser')
      return null
    }

    return stored
  })
  const [user, setUser] = useState(() => {
    const rawUser = localStorage.getItem('authUser')

    if (!rawUser) {
      return null
    }

    try {
      return JSON.parse(rawUser)
    } catch {
      return null
    }
  })

  const login = useCallback(async ({ email, password }) => {
    const response = await loginUser({ email, password })
    const normalized = normalizeLoginPayload(response?.data)

    if (!normalized.token) {
      throw new Error('Login response does not include token')
    }

    localStorage.setItem('authToken', normalized.token)
    setToken(normalized.token)

    if (normalized.user) {
      localStorage.setItem('authUser', JSON.stringify(normalized.user))
      setUser(normalized.user)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token) && !isTokenExpired(token),
      login,
      logout,
    }),
    [token, user, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
