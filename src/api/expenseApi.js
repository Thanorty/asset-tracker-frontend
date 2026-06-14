import apiClient from './apiClient'

export const fetchExpenses = () => {
  return apiClient.get('/api/expenses')
}

export const createExpense = (expense) => {
  return apiClient.post('/api/expenses', expense)
}

export const deleteExpense = (id) => {
  return apiClient.delete(`/api/expenses/${id}`)
}
