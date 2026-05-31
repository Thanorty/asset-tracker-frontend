import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6d7cff',
      light: '#97a3ff',
      dark: '#4e5ad6',
    },
    secondary: {
      main: '#28d3c8',
    },
    success: {
      main: '#41c78b',
    },
    error: {
      main: '#ff6b7a',
    },
    background: {
      default: '#0b1220',
      paper: '#121b2b',
    },
    text: {
      primary: '#e9eefb',
      secondary: '#99a7c2',
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    h4: {
      fontSize: '1.8rem',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            'radial-gradient(circle at top right, rgba(109,124,255,0.18), transparent 38%), #0b1220',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundImage:
            'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))',
          boxShadow: '0 14px 35px rgba(3, 8, 20, 0.35)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 10,
          fontWeight: 600,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(18, 27, 43, 0.82)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(12, 19, 33, 0.92)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.1)',
          backgroundImage:
            'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0))',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: '#a9b6d1',
          fontWeight: 600,
          borderBottom: '1px solid rgba(255,255,255,0.12)',
        },
        body: {
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        },
      },
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
)
