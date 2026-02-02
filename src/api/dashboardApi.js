import apiClient from './apiClient'

export const fetchDashboardSummary = (year, month) => {
  return apiClient.get('/dashboard/summary', {
    params: { year, month },
  })
}