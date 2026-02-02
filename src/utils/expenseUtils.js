export function groupExpensesByCategory(expenses) {
  const map = {}

  expenses.forEach((e) => {
    map[e.category] = (map[e.category] || 0) + e.amount
  })

  return Object.entries(map).map((entry, index) => ({
    id: index,
    label: entry[0],
    value: entry[1],
  }))
}

export function calculateMonthlyTotal(expenses) {
  return expenses.reduce((sum, e) => sum + e.amount, 0)
}
