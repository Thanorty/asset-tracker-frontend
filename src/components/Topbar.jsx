import { AppBar, Toolbar, Typography } from '@mui/material'

export default function Topbar() {
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Typography variant="h6">
          Portfolio Tracker
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
