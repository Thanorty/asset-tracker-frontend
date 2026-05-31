import { Card, CardContent, Typography, Box } from '@mui/material'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import PropTypes from 'prop-types'

export default function SummaryCard({ title, value, subtitle, positive }) {
  const tone =
    positive === undefined ? 'primary.main' : positive ? 'success.main' : 'error.main'

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>

          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              bgcolor: positive === false ? 'rgba(255,107,122,0.16)' : 'rgba(65,199,139,0.15)',
              color: tone,
            }}
          >
            {positive === false ? <TrendingDownIcon fontSize="small" /> : <TrendingUpIcon fontSize="small" />}
          </Box>
        </Box>

        <Box mt={1.5}>
          <Typography variant="h5" color={tone}>
            {value}
          </Typography>
        </Box>

        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

SummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string,
  positive: PropTypes.bool,
}
