import apiClient from './apiClient'

export const fetchCoinList = () => {
  return apiClient.get('/api/pricing/crypto/coins')
}

export const fetchCryptoPrice = (ids, currency = 'usd') => {
  return apiClient.get('/api/pricing/crypto/price', { params: { ids, currency } })
}

export const searchStocks = (query) => {
  return apiClient.get('/api/pricing/stocks/search', { params: { q: query } })
}

export const fetchStockPrice = (symbol) => {
  return apiClient.get('/api/pricing/stocks/price', { params: { symbol } })
}

export const fetchGoldPrice = () => {
  return apiClient.get('/api/pricing/gold/price')
}

export const refreshPrices = () => {
  return apiClient.post('/api/pricing/refresh')
}

