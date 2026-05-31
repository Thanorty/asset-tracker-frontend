import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import PortfolioTable from '../components/PortfolioTable'
import AddAssetDialog from '../components/AddAssetDialog'
import { usePortfolio } from '../hooks/usePortfolio'
import { useNotification } from '../context/useNotification'

export default function PortfolioPage() {
  const { assets, loading, error, retry, addAsset, removeAsset } = usePortfolio()
  const [open, setOpen] = useState(false)
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

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Asset
        </Button>
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
