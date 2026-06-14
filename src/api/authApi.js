import apiClient from './apiClient'

export const loginUser = (credentials) => {
  return apiClient.post('/api/auth/login', credentials)
}

export const registerUser = (data) => {
  data.username = data.name;
  return apiClient.post('/api/auth/register', data)
}
