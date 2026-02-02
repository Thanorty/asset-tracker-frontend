import { Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import SummaryCard from '../components/SummaryCard'
import AllocationPie from '../components/AllocationPie'
import ExpensePie from '../components/ExpensePie'
import { fetchDashboardSummary } from '../api/dashboardApi'

export default function DashboardPage() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetchDashboardSummary(2026, 1)
      .then((res) => setData(res.data))
      .catch(console.error)
  }, [])

  if (!data) return <Typography>Loading...</Typography>

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Total Portfolio Value"
            value={`$${data.totalPortfolioValue.toLocaleString()}`}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <SummaryCard
            title="Monthly Expenses"
            value={`$${data.monthlyExpenses.toFixed(2)}`}
            positive={false}
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
