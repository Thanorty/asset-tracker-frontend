import AddIcon from '@mui/icons-material/Add'
import RefreshIcon from '@mui/icons-material/Refresh'
import { Alert, Box, Button, CircularProgress, Stack, Typography, Tab, Tabs, Chip } from '@mui/material'
import { useState, useMemo } from 'react'
import ExpenseTable from '../components/ExpenseTable'
import AddExpenseDialog from '../components/AddExpenseDialog'
import { useExpenses } from '../hooks/useExpenses'
import { useNotification } from '../context/useNotification'

function groupByMonth(expenses) {
  const groups = {}
  expenses.forEach((exp) => {
    const date = new Date(exp.date)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const label = date.toLocaleString('default', { month: 'long', year: 'numeric' })
    if (!groups[key]) groups[key] = { label, expenses: [] }
    groups[key].expenses.push(exp)
  })
  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([, val]) => val)
}

export default function ExpensesPage() {
  const { expenses, loading, error, retry, addExpense, removeExpense } = useExpenses()
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState(0)
  const notify = useNotification()

  const recurringExpenses = useMemo(() => expenses.filter((e) => e.recurringExpense), [expenses])
  const oneTimeExpenses = useMemo(() => expenses.filter((e) => !e.recurringExpense), [expenses])
  const monthlyGroups = useMemo(() => groupByMonth(tab === 0 ? oneTimeExpenses : recurringExpenses), [tab, oneTimeExpenses, recurringExpenses])

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

      <Box sx={{ mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label={`One-Time (${oneTimeExpenses.length})`} />
          <Tab label={`Recurring (${recurringExpenses.length})`} />
        </Tabs>
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
        <Stack spacing={3}>
          {monthlyGroups.length === 0 && (
            <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
              No expenses in this category yet.
            </Typography>
          )}
          {monthlyGroups.map((group) => (
            <Box key={group.label}>
              <Chip label={group.label} sx={{ mb: 1 }} color="primary" variant="outlined" />
              <ExpenseTable expenses={group.expenses} onDelete={handleDelete} showRecurring={tab === 1} />
            </Box>
          ))}
        </Stack>
      )}

      <AddExpenseDialog
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
      />
    </>
  )
}
