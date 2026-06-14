import apiClient from './apiClient'

export const fetchAssets = () => {
  return apiClient.get('/api/assets')
}

export const createAsset = (asset) => {
  return apiClient.post('/api/assets', asset)
}

export const deleteAsset = (id) => {
  return apiClient.delete(`/api/assets/${id}`)
}
