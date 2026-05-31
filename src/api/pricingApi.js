import apiClient from './apiClient'

export const fetchCoinList = () => {
  return apiClient.get('/pricing/crypto/coins')
}

export const fetchCryptoPrice = (ids, currency = 'usd') => {
  return apiClient.get('/pricing/crypto/price', { params: { ids, currency } })
}

export const searchStocks = (query) => {
  return apiClient.get('/pricing/stocks/search', { params: { q: query } })
}

export const fetchStockPrice = (symbol) => {
  return apiClient.get('/pricing/stocks/price', { params: { symbol } })
}

export const fetchGoldPrice = () => {
  return apiClient.get('/pricing/gold/price')
}

export const refreshPrices = () => {
  return apiClient.post('/pricing/refresh')
}

