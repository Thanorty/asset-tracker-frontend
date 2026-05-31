import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Typography, Toolbar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const menuItems = [
  {
    label: 'Dashboard',
    path: '/',
    icon: <DashboardIcon />,
  },
  {
    label: 'Portfolio',
    path: '/portfolio',
    icon: <AccountBalanceWalletIcon />,
  },
  {
    label: 'Expenses',
    path: '/expenses',
    icon: <ReceiptLongIcon />,
  },
];

const drawerWidth = 252;

function DrawerContent({ location, navigate, onClose }) {
  return (
    <>
      <Toolbar sx={{ minHeight: '72px !important' }}>
        <Box>
          <Typography variant="overline" color="primary.light" sx={{ letterSpacing: 2 }}>
            ASSET TRACKER
          </Typography>
          <Typography variant="h6" sx={{ lineHeight: 1.1 }}>
            Control Center
          </Typography>
        </Box>
      </Toolbar>

      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => {
              navigate(item.path);
              onClose?.();
            }}
            sx={{
              mb: 0.5,
              borderRadius: 2,
              '& .MuiListItemIcon-root': {
                minWidth: 38,
                color: 'text.secondary',
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(109,124,255,0.2)',
                '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                  color: 'primary.light',
                },
              },
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.06)',
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
            />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ mt: 'auto', px: 1.5, pb: 2.5 }}>
        <Typography variant="caption" color="text.secondary">
          Built for smarter investing
        </Typography>
      </Box>
    </>
  );
}

export default function Sidebar({ mobileOpen, onClose, isMobile }) {
  const navigate = useNavigate();
  const location = useLocation();

  const content = <DrawerContent location={location} navigate={navigate} onClose={onClose} />;

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            px: 1.5,
          },
        }}
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          px: 1.5,
        },
      }}
    >
      {content}
    </Drawer>
  );
}

Sidebar.propTypes = {
  mobileOpen: PropTypes.bool,
  onClose: PropTypes.func,
  isMobile: PropTypes.bool,
};
