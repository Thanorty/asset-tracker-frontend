import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import { useState } from 'react'
import PropTypes from 'prop-types'

const categories = ['Food', 'Transport', 'Subscriptions', 'Housing', 'Utilities', 'Insurance']
const initialForm = {
  date: '',
  category: '',
  description: '',
  amount: '',
  recurringExpense: false,
  endDate: '',
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

  const getToday = () => {
  return new Date().toISOString().split("T")[0];
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Expense</DialogTitle>

      <DialogContent>
        <Stack spacing={1.5} sx={{ mt: 1 }}>
          <TextField
            name="date"
            label="Date"
            type="date"
            value={form.date || getToday()}
            fullWidth
            InputLabelProps={{ shrink: true }}
            onChange={handleChange}
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

          <FormControlLabel
            control={
              <Checkbox
                checked={form.recurringExpense}
                onChange={(e) => setForm({ ...form, recurringExpense: e.target.checked, endDate: '' })}
              />
            }
            label="Recurring Expense"
          />

          {form.recurringExpense && (
            <TextField
              name="endDate"
              label="End Date"
              type="date"
              value={form.endDate}
              fullWidth
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
            />
          )}
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
