import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import PropTypes from 'prop-types'
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const titles = {
  '/': 'Dashboard',
  '/portfolio': 'Portfolio',
  '/expenses': 'Expenses',
}

function getInitials(user) {
  if (!user) return '?'

  if (user.name) {
    return user.name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (user.email) {
    return user.email[0].toUpperCase()
  }

  return '?'
}

export default function Topbar({ onMenuClick, isMobile }) {
  const { logout, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const now = useMemo(
    () =>
      new Date().toLocaleDateString(undefined, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }),
    []
  )

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{ zIndex: (theme) => theme.zIndex.drawer - 1 }}
    >
      <Toolbar sx={{ minHeight: '72px !important', px: { xs: 2, md: 3 } }}>
        {isMobile && (
          <IconButton color="inherit" edge="start" onClick={onMenuClick} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
        )}

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="overline" color="primary.light" sx={{ letterSpacing: 2 }}>
            PORTFOLIO TRACKER
          </Typography>
          <Typography variant="h6">{titles[location.pathname] ?? 'Overview'}</Typography>
        </Box>

        <Chip
          icon={<CalendarTodayIcon sx={{ fontSize: '0.95rem !important' }} />}
          label={now}
          variant="outlined"
          sx={{ mr: 1.5, borderColor: 'rgba(255,255,255,0.18)', display: { xs: 'none', sm: 'flex' } }}
        />

        <Tooltip title="Logout">
          <Button
            variant="text"
            color="inherit"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ mr: 1 }}
          >
            Logout
          </Button>
        </Tooltip>

        <Tooltip title={user?.email || ''}>
          <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 14 }}>
            {getInitials(user)}
          </Avatar>
        </Tooltip>
      </Toolbar>
    </AppBar>
  )
}

Topbar.propTypes = {
  onMenuClick: PropTypes.func,
  isMobile: PropTypes.bool,
}
