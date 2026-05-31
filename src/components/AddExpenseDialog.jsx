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

const categories = ['Food', 'Transport', 'Subscriptions', 'Housing', 'Utilities']
const initialForm = {
  date: '',
  category: '',
  description: '',
  amount: '',
}

export default function AddExpenseDialog({ open, onClose, onSave }) {
  const [form, setForm] = useState(initialForm)
  const isInvalid = !form.date || !form.category || !form.amount || Number(form.amount) <= 0

  const handleClose = () => {
    setForm(initialForm)
    onClose()
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = () => {
    onSave(form)
    handleClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Expense</DialogTitle>

      <DialogContent>
        <Stack spacing={1.5} sx={{ mt: 1 }}>
          <TextField
            name="date"
            label="Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
            value={form.date}
          />

          <TextField
            name="category"
            select
            label="Category"
            fullWidth
            onChange={handleChange}
            value={form.category}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            name="description"
            label="Description"
            fullWidth
            onChange={handleChange}
            value={form.description}
          />

          <TextField
            name="amount"
            label="Amount"
            type="number"
            fullWidth
            onChange={handleChange}
            value={form.amount}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isInvalid}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

AddExpenseDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
}
