import { Alert, Snackbar } from '@mui/material'
import { useCallback, useState } from 'react'
import { NotificationContext } from './notification-context'

export function NotificationProvider({ children }) {
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' })

  const notify = useCallback((message, severity = 'success') => {
    setSnack({ open: true, message, severity })
  }, [])

  const handleClose = (_event, reason) => {
    if (reason === 'clickaway') return
    setSnack((prev) => ({ ...prev, open: false }))
  }

  return (
    <NotificationContext.Provider value={notify}>
      {children}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={snack.severity} variant="filled" sx={{ width: '100%' }}>
          {snack.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  )
}

