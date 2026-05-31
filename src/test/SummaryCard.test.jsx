import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import SummaryCard from '../components/SummaryCard'
describe('SummaryCard', () => {
  it('renders title and value', () => {
    render(<SummaryCard title="Total Value" value="$10,000" />)
    expect(screen.getByText('Total Value')).toBeInTheDocument()
    expect(screen.getByText('$10,000')).toBeInTheDocument()
  })
  it('renders subtitle when provided', () => {
    render(<SummaryCard title="Test" value="123" subtitle="Some detail" />)
    expect(screen.getByText('Some detail')).toBeInTheDocument()
  })
  it('does not render subtitle when not provided', () => {
    render(<SummaryCard title="Test" value="123" />)
    expect(screen.queryByText('Some detail')).not.toBeInTheDocument()
  })
})
