import { Card, CardContent, Typography, Box } from '@mui/material'
import { PieChart } from '@mui/x-charts/PieChart'

export default function AllocationPie({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          Asset Allocation
        </Typography>

        <Box display="flex" alignItems="center">
          <PieChart
            series={[
              {
                data,
                innerRadius: 45,
                outerRadius: 90,
                paddingAngle: 3,
                cornerRadius: 4,
              },
            ]}
            height={220}
            width={220}
          />

          <Box ml={3}>
            {data.map((item) => {
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
