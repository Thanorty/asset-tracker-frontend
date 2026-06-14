import apiClient from './apiClient'

export const fetchDashboardSummary = (year, month) => {
  return apiClient.get('/api/dashboard/summary', {
    params: { year, month },
  })
}