import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import TagFilter from '../TagFilter.jsx'

function Wrapper() {
  const [selected, setSelected] = React.useState([])
  return (
    <TagFilter
      tags={['AI', 'ChatGPT']}
      selected={selected}
      onChange={setSelected}
    />
  )
}

describe('TagFilter toolbar', () => {
  test('shows selected count and clears selections', () => {
    render(<Wrapper />)
    const count = screen.getByTestId('selected-count')
    expect(count.textContent).toContain('0')

    fireEvent.click(screen.getByText('#AI'))
    expect(screen.getByTestId('selected-count').textContent).toContain('1')
    const clear = screen.getByTestId('clear-selection')
    fireEvent.click(clear)
    expect(screen.getByTestId('selected-count').textContent).toContain('0')
    expect(screen.queryByTestId('clear-selection')).toBeNull()
  })
})
