import apiClient from './apiClient'

export const fetchSalary = () => {
  return apiClient.get('/api/salary')
}

export const saveSalary = (salary) => {
  return apiClient.put('/api/salary', salary)
}

