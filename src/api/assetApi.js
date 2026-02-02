import apiClient from './apiClient'

export const fetchAssets = () => {
  return apiClient.get('/assets')
}

export const createAsset = (asset) => {
  return apiClient.post('/assets', asset)
}
