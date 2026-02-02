import axios from 'axios'

const apiClient = axios.create({
  baseURL: "https://asset-tracker-backend-production.up.railway.app/api",
})

export default apiClient