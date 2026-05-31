import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
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
  { id: 'name', label: 'Asset' },
  { id: 'type', label: 'Type' },
  { id: 'quantity', label: 'Quantity', numeric: true },
  { id: 'currentValue', label: 'Value (RM)', numeric: true },
]

export default function PortfolioTable({ assets, onDelete }) {
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('name')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const sorted = useMemo(
    () => [...assets].sort(getComparator(order, orderBy)),
    [assets, order, orderBy]
  )

  const paged = sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

  return (
    <Card>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ px: 2.5, pt: 2.5, pb: 1 }}>
          <Typography variant="h6" gutterBottom>
            Portfolio Assets
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {assets.length} holding{assets.length === 1 ? '' : 's'} tracked
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
              {assets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                    <Typography color="text.secondary">
                      No assets yet. Add your first asset to get started.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {paged.map((asset) => (
                <TableRow key={asset.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{asset.name}</TableCell>
                  <TableCell>
                    <Chip size="small" label={asset.type} color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell align="right">{asset.quantity}</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    {Number(asset.currentValue ?? asset.value ?? 0).toLocaleString()}
                  </TableCell>
                  {onDelete && (
                    <TableCell align="center">
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => onDelete(asset.id)}>
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

        {assets.length > 5 && (
          <TablePagination
            component="div"
            count={assets.length}
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

PortfolioTable.propTypes = {
  assets: PropTypes.array.isRequired,
  onDelete: PropTypes.func,
}
