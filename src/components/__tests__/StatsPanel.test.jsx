import { render, screen } from '@testing-library/react'
import StatsPanel from '../StatsPanel.jsx'

describe('StatsPanel compact rendering', () => {
  test('renders only weekly count when compact', () => {
    const links = [
      { createdAt: new Date().toISOString(), tags: ['AI'] }
    ]
    render(<StatsPanel links={links} compact />)
    expect(screen.getByText(/本週新增：/)).toBeInTheDocument()
    expect(screen.queryByText('統計資訊')).toBeNull()
  })
})
