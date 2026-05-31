import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Card,
  CardContent,
  Chip,
  IconButton,
  TableContainer,
  TablePagination,
  TableSortLabel,
  Tooltip,
  Typography,
} from '@mui/material'
import PropTypes from 'prop-types'
import { useMemo, useState } from 'react'

function descendingComparator(a, b, orderBy) {
  const aVal = a[orderBy] ?? ''
  const bVal = b[orderBy] ?? ''

  if (bVal < aVal) return -1
  if (bVal > aVal) return 1
  return 0
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

const headCells = [
  { id: 'date', label: 'Date' },
  { id: 'category', label: 'Category' },
  { id: 'description', label: 'Description' },
  { id: 'amount', label: 'Amount (RM)', numeric: true },
]

export default function ExpenseTable({ expenses, onDelete }) {
  const [order, setOrder] = useState('desc')
  const [orderBy, setOrderBy] = useState('date')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const sorted = useMemo(
    () => [...expenses].sort(getComparator(order, orderBy)),
    [expenses, order, orderBy]
  )

  const paged = sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <Card>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ px: 2.5, pt: 2.5, pb: 1 }}>
          <Typography variant="h6" gutterBottom>
            Expense Ledger
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {expenses.length} expense entr{expenses.length === 1 ? 'y' : 'ies'}
          </Typography>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {headCells.map((cell) => (
                  <TableCell key={cell.id} align={cell.numeric ? 'right' : 'left'}>
                    <TableSortLabel
                      active={orderBy === cell.id}
                      direction={orderBy === cell.id ? order : 'asc'}
                      onClick={() => handleSort(cell.id)}
                    >
                      {cell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                {onDelete && <TableCell align="center" sx={{ width: 60 }} />}
              </TableRow>
            </TableHead>

            <TableBody>
              {expenses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                    <Typography color="text.secondary">
                      No expenses logged yet.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {paged.map((expense) => (
                <TableRow key={expense.id} hover>
                  <TableCell>{expense.date}</TableCell>
                  <TableCell>
                    <Chip size="small" label={expense.category} variant="outlined" />
                  </TableCell>
                  <TableCell>{expense.description || '-'}</TableCell>
                  <TableCell align="right" sx={{ color: 'error.main', fontWeight: 700 }}>
                    {(expense.amount ?? 0).toFixed(2)}
                  </TableCell>
                  {onDelete && (
                    <TableCell align="center">
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => onDelete(expense.id)}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {expenses.length > 5 && (
          <TablePagination
            component="div"
            count={expenses.length}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10))
              setPage(0)
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        )}
      </CardContent>
    </Card>
  )
}

ExpenseTable.propTypes = {
  expenses: PropTypes.array.isRequired,
  onDelete: PropTypes.func,
}
