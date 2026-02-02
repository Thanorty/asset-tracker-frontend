import { Card, CardContent, Typography, Box } from '@mui/material'

export default function SummaryCard({ title, value, subtitle, positive }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary">
          {title}
        </Typography>

        <Box mt={1}>
          <Typography
            variant="h5"
            color={
              positive === undefined
                ? 'text.primary'
                : positive
                ? 'success.main'
                : 'error.main'
            }
          >
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
