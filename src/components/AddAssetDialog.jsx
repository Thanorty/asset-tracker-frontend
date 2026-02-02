import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from '@mui/material'
import { useState } from 'react'

const assetTypes = ['CRYPTO', 'STOCK', 'GOLD']

export default function AddAssetDialog({ open, onClose, onSave }) {
  const [asset, setAsset] = useState({
    name: '',
    type: 'CRYPTO',
    quantity: '',
    currentValue: '',
  })

  const handleChange = (e) => {
    setAsset({ ...asset, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    onSave({
      ...asset,
      quantity: Number(asset.quantity),
      currentValue: Number(asset.currentValue),
    })
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add Asset</DialogTitle>

      <DialogContent sx={{ mt: 1 }}>
        <TextField
          label="Name"
          name="name"
          fullWidth
          margin="dense"
          onChange={handleChange}
        />

        <TextField
          select
          label="Type"
          name="type"
          fullWidth
          margin="dense"
          value={asset.type}
          onChange={handleChange}
        >
          {assetTypes.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Quantity"
          name="quantity"
          type="number"
          fullWidth
          margin="dense"
          onChange={handleChange}
        />

        <TextField
          label="Current Value"
          name="currentValue"
          type="number"
          fullWidth
          margin="dense"
          onChange={handleChange}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
