import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const from = location.state?.from?.pathname || '/'

  if (isAuthenticated) {
    return <Navigate to={from} replace />
  }

  const handleChange = (event) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }))
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await login(form)
      navigate(from, { replace: true })
    } catch (loginError) {
      setError(
        loginError?.response?.data?.message ||
          'Unable to login. Please check your credentials and try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: 2,
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2.5} component="form" onSubmit={handleSubmit}>
            <Stack spacing={1} alignItems="center" textAlign="center">
              <Avatar sx={{ bgcolor: 'primary.main' }}>
                <LockOutlinedIcon fontSize="small" />
              </Avatar>
              <Typography variant="h5">Welcome back</Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in to access your portfolio dashboard.
              </Typography>
            </Stack>

            {error && <Alert severity="error">{error}</Alert>}

            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              autoFocus
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={20} color="inherit" /> : 'Login'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}


