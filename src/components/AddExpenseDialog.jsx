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

export default function AddExpenseDialog({ open, onClose, onSave }) {
  const [form, setForm] = useState({
    date: '',
    category: '',
    description: '',
    amount: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    onSave(form)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Add Expense</DialogTitle>

      <DialogContent>
        <TextField
          name="date"
          type="date"
          fullWidth
          margin="dense"
          onChange={handleChange}
        />

        <TextField
          name="category"
          select
          label="Category"
          fullWidth
          margin="dense"
          onChange={handleChange}
        >
          <MenuItem value="Food">Food</MenuItem>
          <MenuItem value="Transport">Transport</MenuItem>
          <MenuItem value="Subscriptions">Subscriptions</MenuItem>
        </TextField>

        <TextField
          name="description"
          label="Description"
          fullWidth
          margin="dense"
          onChange={handleChange}
        />

        <TextField
          name="amount"
          label="Amount"
          type="number"
          fullWidth
          margin="dense"
          onChange={handleChange}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}
