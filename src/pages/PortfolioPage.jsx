import { Typography, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import PortfolioTable from '../components/PortfolioTable'
import AddAssetDialog from '../components/AddAssetDialog'
import { fetchAssets, createAsset } from '../api/assetApi'

export default function PortfolioPage() {
  const [assets, setAssets] = useState([])
  const [open, setOpen] = useState(false)

  const loadAssets = () => {
    fetchAssets()
      .then((res) => setAssets(res.data))
      .catch(console.error)
  }

  useEffect(() => {
    loadAssets()
  }, [])

  const handleSave = (asset) => {
    createAsset(asset).then(loadAssets)
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Portfolio
      </Typography>

      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => setOpen(true)}
      >
        Add Asset
      </Button>

      <PortfolioTable assets={assets} />

      <AddAssetDialog
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
      />
    </>
  )
}
