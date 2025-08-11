import { render, screen } from '@testing-library/react'
import StatsPanel from '../StatsPanel.jsx'

describe('StatsPanel compact rendering', () => {
  const links = [
    { createdAt: new Date().toISOString(), tags: ['AI'] },
    {
      createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      tags: ['Dev']
    }
  ]

  test('shows compact chips instead of full panel', () => {
    render(<StatsPanel links={links} compact />)
    expect(screen.getByText(/本週新增/)).toBeInTheDocument()
    expect(screen.getByText(/總連結/)).toBeInTheDocument()
    expect(screen.getByText(/標籤總數/)).toBeInTheDocument()
    expect(screen.queryByText('統計資訊')).toBeNull()
  })

  test('uses proper colors for compact stat chips', () => {
    render(<StatsPanel links={links} compact />)
    expect(screen.getByText(/本週新增/)).toHaveClass('bg-blue-50', 'text-blue-700')
    expect(screen.getByText(/總連結/)).toHaveClass('bg-gray-100', 'text-gray-700')
    expect(screen.getByText(/標籤總數/)).toHaveClass('bg-gray-100', 'text-gray-700')
  })
})
