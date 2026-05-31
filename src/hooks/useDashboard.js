import { useCallback, useEffect, useReducer } from 'react'
import { fetchDashboardSummary } from '../api/dashboardApi'

const initialState = { data: null, loading: true, error: null }

function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true, error: null }
    case 'SUCCESS':
      return { data: action.payload, loading: false, error: null }
    case 'ERROR':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

export function useDashboard() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const load = useCallback(() => {
    dispatch({ type: 'LOADING' })

    const now = new Date()

    fetchDashboardSummary(now.getFullYear(), now.getMonth() + 1)
      .then((res) => dispatch({ type: 'SUCCESS', payload: res.data }))
      .catch((err) =>
        dispatch({ type: 'ERROR', payload: err?.response?.data?.message || 'Failed to load dashboard data.' })
      )
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return { ...state, retry: load }
}
