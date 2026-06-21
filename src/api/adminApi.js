import apiClient from './apiClient'

export const fetchUsers = () => {
  return apiClient.get('/api/admin/users')
}

export const createUser = (user) => {
  return apiClient.post('/api/admin/users', user)
}

export const deleteUser = (id) => {
  return apiClient.delete(`/api/admin/users/${id}`)
}

export const updateUserRole = (id, role) => {
  return apiClient.patch(`/api/admin/users/${id}/role`, { role })
}

