import RefreshIcon from '@mui/icons-material/Refresh'
import { Alert, Box, Button, CircularProgress, Grid, Stack, Typography, Card, CardContent, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Chip, Divider, LinearProgress } from '@mui/material'
import SummaryCard from '../components/SummaryCard'
import AllocationPie from '../components/AllocationPie'
import ExpensePie from '../components/ExpensePie'
import { useDashboard } from '../hooks/useDashboard'
import { useExpenses } from '../hooks/useExpenses'
import { useSalary } from '../hooks/useSalary'
import { useMemo } from 'react'

export default function DashboardPage() {
  const { data, loading, error, retry } = useDashboard()
  const { expenses } = useExpenses()
  const { salary } = useSalary()

  const recurringExpenses = useMemo(() => expenses.filter((e) => e.recurringExpense), [expenses])
  const totalRecurring = useMemo(() => recurringExpenses.reduce((sum, e) => sum + (e.amount || 0), 0), [recurringExpenses])

  const netSalary = salary?.netSalary ?? 0
  const grossSalary = salary?.grossSalary ?? 0
  const totalDeductions = salary?.totalDeductions ?? 0
  const monthlyOneTime = data?.monthlyExpenses ?? 0
  const disposable = netSalary - totalRecurring - monthlyOneTime

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

        {/* Salary Breakdown Card */}
        {salary && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Monthly Salary Breakdown
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Stack spacing={1.5}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary">Gross Salary</Typography>
                        <Typography fontWeight={700}>RM{grossSalary.toFixed(2)}</Typography>
                      </Stack>

                      {salary.deductions?.map((d, i) => (
                        <Stack key={i} direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            {d.name}{d.deductionType === 'PERCENTAGE' ? ` (${d.value}%)` : ''}
                          </Typography>
                          <Typography variant="body2" color="error.main">
                            -RM{d.computedAmount.toFixed(2)}
                          </Typography>
                        </Stack>
                      ))}

                      <Divider />

                      <Stack direction="row" justifyContent="space-between">
                        <Typography fontWeight={600}>Net Salary</Typography>
                        <Typography fontWeight={700} color="success.main">
                          RM{netSalary.toFixed(2)}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">− Recurring Expenses</Typography>
                        <Typography variant="body2" color="error.main">-RM{totalRecurring.toFixed(2)}</Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">− This Month&apos;s Expenses</Typography>
                        <Typography variant="body2" color="error.main">-RM{monthlyOneTime.toFixed(2)}</Typography>
                      </Stack>

                      <Divider />

                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="h6">Disposable</Typography>
                        <Typography variant="h6" color={disposable >= 0 ? 'success.main' : 'error.main'}>
                          RM{disposable.toFixed(2)}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Deductions ({grossSalary > 0 ? ((totalDeductions / grossSalary) * 100).toFixed(1) : 0}%)
                        </Typography>
                        <LinearProgress variant="determinate" value={grossSalary > 0 ? Math.min((totalDeductions / grossSalary) * 100, 100) : 0} color="error" sx={{ height: 8, borderRadius: 4 }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Recurring ({netSalary > 0 ? ((totalRecurring / netSalary) * 100).toFixed(1) : 0}%)
                        </Typography>
                        <LinearProgress variant="determinate" value={netSalary > 0 ? Math.min((totalRecurring / netSalary) * 100, 100) : 0} color="warning" sx={{ height: 8, borderRadius: 4 }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Daily Expenses ({netSalary > 0 ? ((monthlyOneTime / netSalary) * 100).toFixed(1) : 0}%)
                        </Typography>
                        <LinearProgress variant="determinate" value={netSalary > 0 ? Math.min((monthlyOneTime / netSalary) * 100, 100) : 0} color="info" sx={{ height: 8, borderRadius: 4 }} />
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Disposable ({grossSalary > 0 ? ((Math.max(disposable, 0) / grossSalary) * 100).toFixed(1) : 0}%)
                        </Typography>
                        <LinearProgress variant="determinate" value={grossSalary > 0 ? Math.min((Math.max(disposable, 0) / grossSalary) * 100, 100) : 0} color="success" sx={{ height: 8, borderRadius: 4 }} />
                      </Box>
                      <Chip
                        label={`Pay cycle: ${salary.salaryCycle?.replace('_', '-') ?? 'MONTHLY'} · Day ${salary.cycleDay ?? 25}`}
                        variant="outlined"
                        size="small"
                        sx={{ alignSelf: 'flex-start' }}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

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

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6">Recurring Expenses</Typography>
                <Chip
                  label={`RM${totalRecurring.toFixed(2)} / month`}
                  color="warning"
                  variant="outlined"
                />
              </Stack>
              {recurringExpenses.length === 0 ? (
                <Typography color="text.secondary">No recurring expenses set up.</Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Category</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell align="right">Amount (RM)</TableCell>
                        <TableCell>End Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recurringExpenses.map((exp) => (
                        <TableRow key={exp.id} hover>
                          <TableCell>
                            <Chip size="small" label={exp.category} variant="outlined" />
                          </TableCell>
                          <TableCell>{exp.description || '-'}</TableCell>
                          <TableCell align="right" sx={{ color: 'error.main', fontWeight: 700 }}>
                            {(exp.amount ?? 0).toFixed(2)}
                          </TableCell>
                          <TableCell>{exp.endDate || 'Ongoing'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
