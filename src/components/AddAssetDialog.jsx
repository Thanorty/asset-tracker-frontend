import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  MenuItem,
  Autocomplete,
  CircularProgress,
  Typography,
} from '@mui/material'
import { useEffect, useState, useCallback } from 'react'
import PropTypes from 'prop-types'
import { fetchCoinList, searchStocks } from '../api/pricingApi'

const assetTypes = ['CRYPTO', 'STOCK', 'GOLD', 'MIGA']

const initialAsset = {
  name: '',
  type: 'CRYPTO',
  symbol: '',
  externalId: '',
  quantity: '',
  buyPrice: '',
}

export default function AddAssetDialog({ open, onClose, onSave }) {
  const [asset, setAsset] = useState(initialAsset)
  const [options, setOptions] = useState([])
  const [loadingOptions, setLoadingOptions] = useState(false)
  const [searchInput, setSearchInput] = useState('')

  const isInvalid =
    (asset.type !== 'GOLD' && asset.type !== 'MIGA') && !asset.name
      ? true
      : !asset.quantity || Number(asset.quantity) <= 0

  // Load crypto coin list when type is CRYPTO
  useEffect(() => {
    if (asset.type === 'CRYPTO' && open) {
      fetchCoinList()
        .then((res) => setOptions(res.data || []))
        .catch(() => setOptions([]))
        .finally(() => setLoadingOptions(false))
    }
  }, [asset.type, open])

  // Search stocks with debounce
  const searchStockDebounced = useCallback(() => {
    if (asset.type !== 'STOCK' || searchInput.length < 2) {
      if (asset.type === 'STOCK') setOptions([])
      return
    }
    setLoadingOptions(true)
    searchStocks(searchInput)
      .then((res) => setOptions(res.data || []))
      .catch(() => setOptions([]))
      .finally(() => setLoadingOptions(false))
  }, [asset.type, searchInput])

  useEffect(() => {
    const timer = setTimeout(searchStockDebounced, 400)
    return () => clearTimeout(timer)
  }, [searchStockDebounced])

  const handleClose = () => {
    setAsset(initialAsset)
    setOptions([])
    setSearchInput('')
    onClose()
  }

  const handleTypeChange = (e) => {
    setAsset({ ...initialAsset, type: e.target.value })
    setOptions([])
    setSearchInput('')
  }

  const handleAssetSelect = (_event, value) => {
    if (!value) {
      setAsset((prev) => ({ ...prev, name: '', symbol: '', externalId: '' }))
      return
    }

    if (asset.type === 'CRYPTO') {
      setAsset((prev) => ({
        ...prev,
        name: value.name,
        symbol: value.symbol?.toUpperCase() || '',
        externalId: value.id,
      }))
    } else if (asset.type === 'STOCK') {
      setAsset((prev) => ({
        ...prev,
        name: value.name,
        symbol: value.symbol,
        externalId: value.symbol,
      }))
    }
  }

  const handleSubmit = () => {
    const payload = {
      name: asset.name,
      type: asset.type,
      symbol: asset.symbol,
      externalId: asset.externalId,
      buyPrice: Number(asset.buyPrice),
      quantity: Number(asset.quantity),
    }

    // For gold, set defaults
    if (asset.type === 'GOLD') {
      payload.name = 'Gold'
      payload.symbol = 'GOLD'
      payload.externalId = 'gold'
    } else if (asset.type === 'MIGA') {
       payload.name = 'Maybank Gold'
      payload.symbol = 'MIGA'
      payload.externalId = 'maybank-gold'
    }

    onSave(payload)
    handleClose()
  }

  const getOptionLabel = (option) => {
    if (typeof option === 'string') return option
    if (asset.type === 'CRYPTO') return `${option.name} (${option.symbol?.toUpperCase()})`
    if (asset.type === 'STOCK') return `${option.symbol} — ${option.name} (${option.exchange || ''})`
    return option.name || ''
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Asset</DialogTitle>

      <DialogContent sx={{ mt: 1 }}>
        <Stack spacing={2}>
          <TextField
            select
            label="Type"
            name="type"
            fullWidth
            value={asset.type}
            onChange={handleTypeChange}
          >
            {assetTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>

          {asset.type === 'GOLD' ? (
            <Typography variant="body2" color="text.secondary">
              Gold — price updated automatically (MYR/gram)
            </Typography>
          ) : asset.type === 'MIGA' ? (
            <Typography variant="body2" color="text.secondary">
              Maybank Gold — price updated automatically (MYR/gram)
            </Typography>
          ) : (
            <Autocomplete
              options={options}
              getOptionLabel={getOptionLabel}
              loading={loadingOptions}
              onInputChange={(_e, value) => setSearchInput(value)}
              onChange={handleAssetSelect}
              isOptionEqualToValue={(option, value) =>
                (option.id || option.symbol) === (value.id || value.symbol)
              }
              filterOptions={asset.type === 'STOCK' ? (x) => x : undefined}
              noOptionsText={
                asset.type === 'STOCK' && searchInput.length < 2
                  ? 'Type at least 2 characters to search'
                  : 'No options found'
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={asset.type === 'CRYPTO' ? 'Search Cryptocurrency' : 'Search Stock / ETF'}
                  placeholder={asset.type === 'CRYPTO' ? 'e.g. Bitcoin' : 'e.g. AAPL, MSFT'}
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loadingOptions && <CircularProgress color="inherit" size={20} />}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    },
                  }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.id || option.symbol}>
                  <Stack>
                    <Typography variant="body2" fontWeight={600}>
                      {asset.type === 'CRYPTO'
                        ? `${option.name} (${option.symbol?.toUpperCase()})`
                        : `${option.symbol} — ${option.name}`}
                    </Typography>
                    {asset.type === 'STOCK' && option.exchange && (
                      <Typography variant="caption" color="text.secondary">
                        {option.exchange}
                      </Typography>
                    )}
                  </Stack>
                </li>
              )}
            />
          )}

          <TextField
            label={asset.type in ['GOLD', 'MIGA'] ? 'Quantity (grams)' : 'Quantity'}
            name="quantity"
            type="number"
            fullWidth
            onChange={(e) => setAsset({ ...asset, quantity: e.target.value })}
            value={asset.quantity}
          />
          <TextField
            label="Buy Price"
            name="buyPrice"
            type="number"
            fullWidth
            onChange={(e) => setAsset({ ...asset, buyPrice: e.target.value })}
            value={asset.buyPrice}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isInvalid}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

AddAssetDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}
