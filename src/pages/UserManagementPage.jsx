import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import RefreshIcon from '@mui/icons-material/Refresh'
import { useState } from 'react'
import { useAdminUsers } from '../hooks/useAdminUsers'
import { useNotification } from '../context/useNotification'

const initialForm = { username: '', email: '', password: '', role: 'USER' }

export default function UserManagementPage() {
  const { users, loading, error, retry, addUser, removeUser, changeRole } = useAdminUsers()
  const notify = useNotification()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(initialForm)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleCreate = async () => {
    try {
      await addUser(form)
      notify('User created successfully!')
      setForm(initialForm)
      setOpen(false)
    } catch (err) {
      notify(err?.response?.data?.message || 'Failed to create user.', 'error')
    }
  }

  const handleDelete = async (id, username) => {
    if (!window.confirm(`Delete user "${username}"?`)) return
    try {
      await removeUser(id)
      notify('User deleted.')
    } catch (err) {
      notify(err?.response?.data?.message || 'Failed to delete user.', 'error')
    }
  }

  const handleRoleToggle = async (id, currentRole) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN'
    try {
      await changeRole(id, newRole)
      notify(`Role updated to ${newRole}.`)
    } catch (err) {
      notify(err?.response?.data?.message || 'Failed to update role.', 'error')
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
      <Box
        sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 2, alignItems: 'center' }}
      >
        <Stack spacing={0.5}>
          <Typography variant="h4">User Management</Typography>
          <Typography color="text.secondary">
            Add, remove, or change roles for application users.
          </Typography>
        </Stack>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Add User
        </Button>
      </Box>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell align="center" sx={{ width: 120 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                      <Typography color="text.secondary">No users found.</Typography>
                    </TableCell>
                  </TableRow>
                )}
                {users.map((u) => (
                  <TableRow key={u.id} hover>
                    <TableCell>{u.id}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{u.username}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={u.role}
                        color={u.role === 'ADMIN' ? 'secondary' : 'default'}
                        variant="outlined"
                        onClick={() => handleRoleToggle(u.id, u.role)}
                        sx={{ cursor: 'pointer' }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => handleDelete(u.id, u.username)}>
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <Stack spacing={1.5} sx={{ mt: 1 }}>
            <TextField name="username" label="Username" fullWidth value={form.username} onChange={handleChange} />
            <TextField name="email" label="Email" type="email" fullWidth value={form.email} onChange={handleChange} />
            <TextField name="password" label="Password" type="password" fullWidth value={form.password} onChange={handleChange} />
            <TextField name="role" select label="Role" fullWidth value={form.role} onChange={handleChange}>
              <MenuItem value="USER">USER</MenuItem>
              <MenuItem value="ADMIN">ADMIN</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={!form.username || !form.email || !form.password}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

