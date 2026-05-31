import apiClient from './apiClient'

export const fetchAssets = () => {
  return apiClient.get('/assets')
}

export const createAsset = (asset) => {
  return apiClient.post('/assets', asset)
}

export const deleteAsset = (id) => {
  return apiClient.delete(`/assets/${id}`)
}
