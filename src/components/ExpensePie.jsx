import { Card, CardContent, Typography } from '@mui/material'
import { PieChart } from '@mui/x-charts/PieChart'

export default function ExpensePie({ data }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          Expense Breakdown
        </Typography>

        <PieChart
          series={[
            {
              data,
              innerRadius: 40,
              outerRadius: 90,
              paddingAngle: 3,
            },
          ]}
          height={220}
        />
      </CardContent>
    </Card>
  )
}