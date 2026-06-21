import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import SaveIcon from '@mui/icons-material/Save'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useEffect, useState } from 'react'
import { useSalary } from '../hooks/useSalary'
import { useNotification } from '../context/useNotification'

const cycles = ['MONTHLY', 'BI_WEEKLY', 'WEEKLY']
const deductionTypes = ['PERCENTAGE', 'FIXED']

const defaultDeductions = [
  { name: 'EPF (Employee)', deductionType: 'PERCENTAGE', value: 11 },
  { name: 'SOCSO', deductionType: 'PERCENTAGE', value: 0.5 },
  { name: 'EIS', deductionType: 'PERCENTAGE', value: 0.2 },
  { name: 'PCB (Tax)', deductionType: 'FIXED', value: 0 },
]

export default function SalaryPage() {
  const { salary, loading, error, retry, save } = useSalary()
  const notify = useNotification()

  const [grossSalary, setGrossSalary] = useState('')
  const [salaryCycle, setSalaryCycle] = useState('MONTHLY')
  const [cycleDay, setCycleDay] = useState(25)
  const [deductions, setDeductions] = useState(defaultDeductions)
  const [saving, setSaving] = useState(false)

  // Populate form when salary loads
  useEffect(() => {
    if (salary) {
      setGrossSalary(salary.grossSalary ?? '')
      setSalaryCycle(salary.salaryCycle ?? 'MONTHLY')
      setCycleDay(salary.cycleDay ?? 25)
      setDeductions(
        salary.deductions?.length > 0
          ? salary.deductions.map((d) => ({
              name: d.name,
              deductionType: d.deductionType,
              value: d.value,
            }))
          : defaultDeductions
      )
    }
  }, [salary])

  const gross = Number(grossSalary) || 0

  const computedDeductions = deductions.map((d) => {
    const amount = d.deductionType === 'PERCENTAGE' ? (gross * (d.value || 0)) / 100 : d.value || 0
    return { ...d, computedAmount: Math.round(amount * 100) / 100 }
  })

  const totalDeductions = computedDeductions.reduce((s, d) => s + d.computedAmount, 0)
  const netSalary = Math.round((gross - totalDeductions) * 100) / 100

  const handleDeductionChange = (index, field, value) => {
    setDeductions((prev) =>
      prev.map((d, i) => (i === index ? { ...d, [field]: field === 'value' ? Number(value) : value } : d))
    )
  }

  const addDeduction = () => {
    setDeductions((prev) => [...prev, { name: '', deductionType: 'PERCENTAGE', value: 0 }])
  }

  const removeDeduction = (index) => {
    setDeductions((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSave = async () => {
    if (!gross || gross <= 0) {
      notify('Please enter a valid gross salary.', 'error')
      return
    }
    setSaving(true)
    try {
      await save({ grossSalary: gross, salaryCycle, cycleDay, deductions })
      notify('Salary configuration saved!')
    } catch (err) {
      notify(err?.response?.data?.message || 'Failed to save salary.', 'error')
    } finally {
      setSaving(false)
    }
  }

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

  return (
    <>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4">Salary</Typography>
        <Typography color="text.secondary">
          Configure your gross salary, pay cycle, and add any deductions dynamically.
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {/* Left: Config */}
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Salary Details
              </Typography>

              <Stack spacing={2}>
                <TextField
                  label="Gross Salary (RM)"
                  type="number"
                  value={grossSalary}
                  onChange={(e) => setGrossSalary(e.target.value)}
                  fullWidth
                />

                <Stack direction="row" spacing={2}>
                  <TextField
                    select
                    label="Salary Cycle"
                    value={salaryCycle}
                    onChange={(e) => setSalaryCycle(e.target.value)}
                    fullWidth
                  >
                    {cycles.map((c) => (
                      <MenuItem key={c} value={c}>
                        {c.replace('_', '-')}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    label="Pay Day"
                    type="number"
                    value={cycleDay}
                    onChange={(e) => setCycleDay(Number(e.target.value))}
                    inputProps={{ min: 1, max: 31 }}
                    fullWidth
                  />
                </Stack>
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h6">Deductions</Typography>
                <Button size="small" startIcon={<AddIcon />} onClick={addDeduction}>
                  Add Deduction
                </Button>
              </Stack>

              <Stack spacing={1.5}>
                {deductions.map((d, i) => (
                  <Stack key={i} direction="row" spacing={1} alignItems="center">
                    <TextField
                      label="Name"
                      size="small"
                      value={d.name}
                      onChange={(e) => handleDeductionChange(i, 'name', e.target.value)}
                      sx={{ flex: 2 }}
                    />
                    <TextField
                      select
                      label="Type"
                      size="small"
                      value={d.deductionType}
                      onChange={(e) => handleDeductionChange(i, 'deductionType', e.target.value)}
                      sx={{ flex: 1 }}
                    >
                      {deductionTypes.map((t) => (
                        <MenuItem key={t} value={t}>
                          {t === 'PERCENTAGE' ? '%' : 'RM'}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      label="Value"
                      type="number"
                      size="small"
                      value={d.value}
                      onChange={(e) => handleDeductionChange(i, 'value', e.target.value)}
                      sx={{ flex: 1 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{ flex: 1, textAlign: 'right', fontWeight: 600, color: 'error.main' }}
                    >
                      -RM{computedDeductions[i]?.computedAmount.toFixed(2)}
                    </Typography>
                    <Tooltip title="Remove">
                      <IconButton size="small" color="error" onClick={() => removeDeduction(i)}>
                        <DeleteOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                ))}
              </Stack>

              <Box sx={{ mt: 3, textAlign: 'right' }}>
                <Button
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <SaveIcon />}
                  onClick={handleSave}
                  disabled={saving}
                >
                  Save
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Right: Summary */}
        <Grid item xs={12} md={5}>
          <Card sx={{ position: 'sticky', top: 24 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Pay Slip Summary
              </Typography>

              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Gross Salary</Typography>
                  <Typography fontWeight={700}>RM{gross.toFixed(2)}</Typography>
                </Stack>

                <Divider />

                {computedDeductions.map((d, i) => (
                  <Stack key={i} direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      {d.name || 'Unnamed'}
                      {d.deductionType === 'PERCENTAGE' ? ` (${d.value}%)` : ''}
                    </Typography>
                    <Typography variant="body2" color="error.main">
                      -RM{d.computedAmount.toFixed(2)}
                    </Typography>
                  </Stack>
                ))}

                <Divider />

                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Total Deductions</Typography>
                  <Typography fontWeight={700} color="error.main">
                    -RM{totalDeductions.toFixed(2)}
                  </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6">Net Salary</Typography>
                  <Typography variant="h6" color="success.main">
                    RM{netSalary.toFixed(2)}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

