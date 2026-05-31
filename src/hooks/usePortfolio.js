import { useCallback, useEffect, useReducer } from 'react'
import { fetchAssets, createAsset, deleteAsset } from '../api/assetApi'

const initialState = { assets: [], loading: true, error: null }

function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true, error: null }
    case 'SUCCESS':
      return { assets: action.payload, loading: false, error: null }
    case 'ERROR':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

export function usePortfolio() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const load = useCallback(() => {
    dispatch({ type: 'LOADING' })
    fetchAssets()
      .then((res) => dispatch({ type: 'SUCCESS', payload: res.data }))
      .catch((err) =>
        dispatch({ type: 'ERROR', payload: err?.response?.data?.message || 'Failed to load assets.' })
      )
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const addAsset = useCallback(async (asset) => {
    await createAsset(asset)
    load()
  }, [load])

  const removeAsset = useCallback(async (id) => {
    await deleteAsset(id)
    load()
  }, [load])

  return { ...state, retry: load, addAsset, removeAsset }
}
