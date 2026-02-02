import apiClient from './apiClient'

export const fetchExpenses = () => {
  return apiClient.get('/expenses')
}

export const createExpense = (expense) => {
  return apiClient.post('/expenses', expense)
}
