import { useCallback, useEffect, useReducer } from 'react'
import { fetchExpenses, createExpense, deleteExpense } from '../api/expenseApi'

const initialState = { expenses: [], loading: true, error: null }

function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true, error: null }
    case 'SUCCESS':
      return { expenses: action.payload, loading: false, error: null }
    case 'ERROR':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

export function useExpenses() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const load = useCallback(() => {
    dispatch({ type: 'LOADING' })
    fetchExpenses()
      .then((res) => dispatch({ type: 'SUCCESS', payload: res.data }))
      .catch((err) =>
        dispatch({ type: 'ERROR', payload: err?.response?.data?.message || 'Failed to load expenses.' })
      )
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const addExpense = useCallback(async (expense) => {
    await createExpense(expense)
    load()
  }, [load])

  const removeExpense = useCallback(async (id) => {
    await deleteExpense(id)
    load()
  }, [load])

  return { ...state, retry: load, addExpense, removeExpense }
}
