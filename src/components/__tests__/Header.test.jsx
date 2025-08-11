import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from '../Header.jsx'

describe('Header', () => {
  test('renders as sticky', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )
    const nav = screen.getByRole('navigation')
    expect(nav).toHaveClass('sticky')
  })

  test('highlights active link', () => {
    render(
      <MemoryRouter initialEntries={['/explore']}>
        <Header />
      </MemoryRouter>
    )
    const explore = screen.getByRole('link', { name: /explore/i })
    const myLinks = screen.getByRole('link', { name: /my links/i })
    expect(explore).toHaveClass('bg-blue-500')
    expect(myLinks).not.toHaveClass('bg-blue-500')
  })
})
