import { useCallback, useEffect, useReducer } from 'react'
import { fetchSalary, saveSalary } from '../api/salaryApi'

const initialState = { salary: null, loading: true, error: null }

function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true, error: null }
    case 'SUCCESS':
      return { salary: action.payload, loading: false, error: null }
    case 'NO_DATA':
      return { salary: null, loading: false, error: null }
    case 'ERROR':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

export function useSalary() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const load = useCallback(() => {
    dispatch({ type: 'LOADING' })
    fetchSalary()
      .then((res) => {
        if (res.status === 204 || !res.data) {
          dispatch({ type: 'NO_DATA' })
        } else {
          dispatch({ type: 'SUCCESS', payload: res.data })
        }
      })
      .catch((err) =>
        dispatch({ type: 'ERROR', payload: err?.response?.data?.message || 'Failed to load salary.' })
      )
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const save = useCallback(async (data) => {
    const res = await saveSalary(data)
    dispatch({ type: 'SUCCESS', payload: res.data })
    return res.data
  }, [])

  return { ...state, retry: load, save }
}

