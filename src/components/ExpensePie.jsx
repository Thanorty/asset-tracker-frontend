import { Card, CardContent, Typography } from '@mui/material'
import { PieChart } from '@mui/x-charts/PieChart'
import PropTypes from 'prop-types'

const chartColors = ['#ff6b7a', '#6d7cff', '#f9b86d', '#28d3c8', '#ca8cff']

export default function ExpensePie({ data }) {
  const safeData = data.map((item, index) => ({
    ...item,
    color: item.color ?? chartColors[index % chartColors.length],
  }))

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          Expense Breakdown
        </Typography>

        <PieChart
          series={[
            {
              data: safeData,
              innerRadius: 40,
              outerRadius: 90,
              paddingAngle: 3,
              cornerRadius: 4,
            },
          ]}
          height={220}
          slotProps={{ legend: { hidden: true } }}
        />
      </CardContent>
    </Card>
  )
}

ExpensePie.propTypes = {
  data: PropTypes.array.isRequired,
}
