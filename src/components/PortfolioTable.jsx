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
  { id: 'symbol', label: 'Symbol' },
  { id: 'type', label: 'Type' },
  { id: 'quantity', label: 'Quantity', numeric: true },
  { id: 'unitPrice', label: 'Unit Price', numeric: true },
  { id: 'buyPrice', label: 'Buy Price', numeric: true },
  { id: 'currentValue', label: 'Total Value', numeric: true },
  { id: 'plVal', label: 'Profit/Loss' },
  { id: 'lastPriceUpdate', label: 'Updated', numeric: false },
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

  const formatCurrency = (value, currency) => {
    if (value == null) return '—'
    const symbol = currency === 'MYR' ? 'RM' : '$'
    return `${symbol}${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const timeAgo = (dateStr) => {
    if (!dateStr) return '—'
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

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
                  <TableCell colSpan={headCells.length + 1} align="center" sx={{ py: 5 }}>
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
                    <Typography variant="body2" color="text.secondary">
                      {asset.symbol || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip size="small" label={asset.type} color="primary" variant="outlined" />
                  </TableCell>
                  <TableCell align="right">{asset.quantity}</TableCell>
                  <TableCell align="right">
                    {formatCurrency(asset.unitPrice, asset.currency)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(asset.buyPrice, asset.currency)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    {formatCurrency(asset.currentValue, asset.currency)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>
                    {asset.buyPrice != null && asset.unitPrice != null
                      ? (() => {
                          const plPercent = ((asset.unitPrice - asset.buyPrice) / asset.buyPrice) * 100
                          const isProfit = plPercent >= 0
                          return (
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 700, color: isProfit ? 'success.main' : 'error.main' }}
                            >
                              {isProfit ? '+' : ''}{plPercent.toFixed(2)}%
                            </Typography>
                          )
                        })()
                      : '—'}
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" color="text.secondary">
                      {timeAgo(asset.lastPriceUpdate)}
                    </Typography>
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
