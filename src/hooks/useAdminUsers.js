import { useCallback, useEffect, useReducer } from 'react'
import { fetchUsers, createUser, deleteUser, updateUserRole } from '../api/adminApi'

const initialState = { users: [], loading: true, error: null }

function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true, error: null }
    case 'SUCCESS':
      return { users: action.payload, loading: false, error: null }
    case 'ERROR':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

export function useAdminUsers() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const load = useCallback(() => {
    dispatch({ type: 'LOADING' })
    fetchUsers()
      .then((res) => dispatch({ type: 'SUCCESS', payload: res.data }))
      .catch((err) =>
        dispatch({ type: 'ERROR', payload: err?.response?.data?.message || 'Failed to load users.' })
      )
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const addUser = useCallback(async (user) => {
    await createUser(user)
    load()
  }, [load])

  const removeUser = useCallback(async (id) => {
    await deleteUser(id)
    load()
  }, [load])

  const changeRole = useCallback(async (id, role) => {
    await updateUserRole(id, role)
    load()
  }, [load])

  return { ...state, retry: load, addUser, removeUser, changeRole }
}

