import RefreshIcon from '@mui/icons-material/Refresh'
import { Alert, Box, Button, CircularProgress, Grid, Stack, Typography } from '@mui/material'
import SummaryCard from '../components/SummaryCard'
import AllocationPie from '../components/AllocationPie'
import ExpensePie from '../components/ExpensePie'
import { useDashboard } from '../hooks/useDashboard'

export default function DashboardPage() {
  const { data, loading, error, retry } = useDashboard()

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2, justifyContent: 'center' }}>
          {error}
        </Alert>
        <Button variant="outlined" startIcon={<RefreshIcon />} onClick={retry}>
          Retry
        </Button>
      </Box>
    )
  }

  if (!data) return null

  return (
    <>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4">Dashboard</Typography>
        <Typography color="text.secondary">
          Track your portfolio performance and spending at a glance.
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Total Portfolio Value"
            value={`RM${data.totalPortfolioValue.toLocaleString()}`}
            subtitle="Across all tracked assets"
            positive
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Monthly Expenses"
            value={`RM${(data.monthlyExpenses ?? 0).toFixed(2)}`}
            positive={false}
            subtitle="Current month burn rate"
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Top Allocation"
            value={Object.keys(data.assetAllocation ?? {})[0] ?? 'N/A'}
            subtitle="Largest asset category"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <AllocationPie
            data={Object.entries(data.assetAllocation).map(
              ([label, value], index) => ({
                id: index,
                label,
                value,
              })
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <ExpensePie
            data={Object.entries(data.expenseByCategory).map(
              ([label, value], index) => ({
                id: index,
                label,
                value,
              })
            )}
          />
        </Grid>
      </Grid>
    </>
  )
}
