import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Home from '../Home.jsx'

describe('Home navigation', () => {
  test('navigates to My Links page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/my-links" element={<div>My Links Page</div>} />
        </Routes>
      </MemoryRouter>
    )

    fireEvent.click(screen.getByText('我的連結'))
    expect(screen.getByText('My Links Page')).toBeInTheDocument()
  })
})
