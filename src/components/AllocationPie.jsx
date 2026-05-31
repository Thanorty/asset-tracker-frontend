import { Card, CardContent, Typography, Box } from '@mui/material'
import { PieChart } from '@mui/x-charts/PieChart'
import PropTypes from 'prop-types'

const chartColors = ['#6d7cff', '#28d3c8', '#f9b86d', '#7de18f', '#ca8cff']

export default function AllocationPie({ data }) {
  const safeData = data.map((item, index) => ({
    ...item,
    color: item.color ?? chartColors[index % chartColors.length],
  }))
  const total = safeData.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          Asset Allocation
        </Typography>

        <Box display="flex" alignItems="center" flexWrap="wrap" gap={1}>
          <PieChart
            series={[
              {
                data: safeData,
                innerRadius: 45,
                outerRadius: 90,
                paddingAngle: 3,
                cornerRadius: 4,
              },
            ]}
            height={220}
            width={220}
          />

          <Box ml={{ xs: 0, md: 1.5 }}>
            {safeData.map((item) => {
              const percent =
                total > 0 && item.value != null
                  ? ((item.value / total) * 100).toFixed(1)
                  : '0.0'


              return (
                <Box
                  key={item.id}
                  display="flex"
                  alignItems="center"
                  mb={1}
                >
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: item.color,
                      mr: 1,
                    }}
                  />
                  <Typography variant="body2">
                    {item.label} — {percent}%
                  </Typography>
                </Box>
              )
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

AllocationPie.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      label: PropTypes.string,
      value: PropTypes.number,
      color: PropTypes.string,
    })
  ).isRequired,
}
