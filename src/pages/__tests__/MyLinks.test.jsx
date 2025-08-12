import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MyLinks from '../MyLinks.jsx'
import normalizeItem from '../../utils/normalizeItem.js'

describe('MyLinks filtering', () => {
  test('filters by tags with AND behaviour', () => {
    const user = 'user'
    const links = [
      { ...normalizeItem({ url: 'http://a', title: 'A', tags: ['t1'] }, user) },
      { ...normalizeItem({ url: 'http://b', title: 'B', tags: ['t1'] }, user) },
      { ...normalizeItem({ url: 'http://c', title: 'C', tags: ['t2'] }, user) },
    ]

    render(
      <MemoryRouter>
        <MyLinks initialLinks={links} />
      </MemoryRouter>
    )

    // all links render initially
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()

    // apply tag filter t2
    fireEvent.click(screen.getAllByText('#t2')[0])
    expect(screen.queryByText('A')).toBeNull()
    expect(screen.queryByText('B')).toBeNull()
    expect(screen.getByText('C')).toBeInTheDocument()
  })
})

describe('normalizeItem', () => {
  test('defaults classify fields to null', () => {
    const item = normalizeItem({ url: 'http://x' }, 'user')
    expect(item.classify).toEqual({ tone: null, theme: null, emotion: null })
  })

  test('retains provided classify fields', () => {
    const item = normalizeItem({ url: 'http://x', classify: { tone: '理性' } }, 'user')
    expect(item.classify).toEqual({ tone: '理性', theme: null, emotion: null })
  })
})
