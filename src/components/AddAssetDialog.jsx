import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  MenuItem,
} from '@mui/material'
import { useState } from 'react'
import PropTypes from 'prop-types'

const assetTypes = ['CRYPTO', 'STOCK', 'GOLD']
const initialAsset = {
  name: '',
  type: 'CRYPTO',
  quantity: '',
  currentValue: '',
}

export default function AddAssetDialog({ open, onClose, onSave }) {
  const [asset, setAsset] = useState(initialAsset)
  const isInvalid =
    !asset.name || !asset.quantity || !asset.currentValue || Number(asset.quantity) <= 0

  const handleClose = () => {
    setAsset(initialAsset)
    onClose()
  }

  const handleChange = (e) => {
    setAsset({ ...asset, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    onSave({
      ...asset,
      quantity: Number(asset.quantity),
      currentValue: Number(asset.currentValue),
    })
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Asset</DialogTitle>

      <DialogContent sx={{ mt: 1 }}>
        <Stack spacing={1.5}>
          <TextField
            label="Name"
            name="name"
            fullWidth
            onChange={handleChange}
            value={asset.name}
          />

          <TextField
            select
            label="Type"
            name="type"
            fullWidth
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
            onChange={handleChange}
            value={asset.quantity}
          />

          <TextField
            label="Current Value"
            name="currentValue"
            type="number"
            fullWidth
            onChange={handleChange}
            value={asset.currentValue}
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
