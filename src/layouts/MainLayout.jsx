import { Box, useMediaQuery, useTheme } from '@mui/material'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'

export default function MainLayout() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        isMobile={isMobile}
      />

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Topbar onMenuClick={() => setMobileOpen(true)} isMobile={isMobile} />

        <Box
          sx={{
            p: { xs: 2, md: 3 },
            maxWidth: 1400,
            mx: 'auto',
            width: '100%',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
