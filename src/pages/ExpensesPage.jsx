import { Typography, Button } from '@mui/material'
import { useEffect, useState } from 'react'
import ExpenseTable from '../components/ExpenseTable'
import AddExpenseDialog from '../components/AddExpenseDialog'
import { fetchExpenses, createExpense } from '../api/expenseApi'

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetchExpenses()
      .then((res) => setExpenses(res.data))
      .catch(console.error)
  }, [])

  const handleSave = (expense) => {
    createExpense(expense).then(() => {
      fetchExpenses().then((res) => setExpenses(res.data))
    })
  }

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Expenses
      </Typography>

      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => setOpen(true)}
      >
        Add Expense
      </Button>

      <ExpenseTable expenses={expenses} />

      <AddExpenseDialog
        open={open}
        onClose={() => setOpen(false)}
        onSave={handleSave}
      />
    </>
  )
}
