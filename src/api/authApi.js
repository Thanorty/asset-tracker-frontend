import apiClient from './apiClient'

export const loginUser = (credentials) => {
  return apiClient.post('/auth/login', credentials)
}

