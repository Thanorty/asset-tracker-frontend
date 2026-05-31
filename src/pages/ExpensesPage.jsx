import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import ExpenseTable from '../components/ExpenseTable'
import AddExpenseDialog from '../components/AddExpenseDialog'
import { useExpenses } from '../hooks/useExpenses'
import { useNotification } from '../context/useNotification'

export default function ExpensesPage() {
  const { expenses, loading, error, retry, addExpense, removeExpense } = useExpenses()
  const [open, setOpen] = useState(false)
  const notify = useNotification()

  const handleSave = async (expense) => {
    try {
      await addExpense(expense)
      notify('Expense added successfully!')
    } catch (err) {
      notify(err?.response?.data?.message || 'Failed to add expense.', 'error')
    }
  }

  const handleDelete = async (id) => {
    try {
      await removeExpense(id)
      notify('Expense deleted.')
    } catch (err) {
      notify(err?.response?.data?.message || 'Failed to delete expense.', 'error')
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
          <Typography variant="h4">Expenses</Typography>
          <Typography color="text.secondary">
            Capture every outgoing transaction and keep spending visible.
          </Typography>
        </Stack>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Expense
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
        <ExpenseTable expenses={expenses} onDelete={handleDelete} />
      )}

      <AddExpenseDialog
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
      />
    </>
  )
}
