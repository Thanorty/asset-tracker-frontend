import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import SyncIcon from '@mui/icons-material/Sync'
import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import PortfolioTable from '../components/PortfolioTable'
import AddAssetDialog from '../components/AddAssetDialog'
import { usePortfolio } from '../hooks/usePortfolio'
import { useNotification } from '../context/useNotification'
import { refreshPrices } from '../api/pricingApi'

export default function PortfolioPage() {
  const { assets, loading, error, retry, addAsset, removeAsset } = usePortfolio()
  const [open, setOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const notify = useNotification()

  const handleSave = async (asset) => {
    try {
      await addAsset(asset)
      notify('Asset added successfully!')
    } catch (err) {
      notify(err?.response?.data?.message || 'Failed to add asset.', 'error')
    }
  }

  const handleDelete = async (id) => {
    try {
      await removeAsset(id)
      notify('Asset deleted.')
    } catch (err) {
      notify(err?.response?.data?.message || 'Failed to delete asset.', 'error')
    }
  }

  const handleRefreshPrices = async () => {
    setRefreshing(true)
    try {
      const res = await refreshPrices()
      notify(`Prices updated: ${res.data.updated} assets refreshed`)
      retry()
    } catch (err) {
      notify(err?.response?.data?.message || 'Failed to refresh prices.', 'error')
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <>
      <Box
        sx={{
          mb: 3,
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: 2,
          alignItems: 'center',
        }}
      >
        <Stack spacing={0.5}>
          <Typography variant="h4">Portfolio</Typography>
          <Typography color="text.secondary">
            Manage assets and monitor your holdings in one place.
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            startIcon={refreshing ? <CircularProgress size={18} /> : <SyncIcon />}
            onClick={handleRefreshPrices}
            disabled={refreshing}
          >
            {refreshing ? 'Updating…' : 'Refresh Prices'}
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
          >
            Add Asset
          </Button>
        </Stack>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {error && !loading && (
        <Box sx={{ py: 6, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 2, justifyContent: 'center' }}>
            {error}
          </Alert>
          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={retry}>
            Retry
          </Button>
        </Box>
      )}

      {!loading && !error && (
        <PortfolioTable assets={assets} onDelete={handleDelete} />
      )}

      <AddAssetDialog
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
      />
    </>
  )
}
