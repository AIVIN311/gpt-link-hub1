import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import ClassifyFilter from '../ClassifyFilter.jsx'

function Wrapper() {
  const [state, setState] = React.useState({
    tone: null,
    theme: null,
    emotion: null,
  })
  return (
    <>
      <span data-testid="tone-val">{state.tone ?? ''}</span>
      <ClassifyFilter
        toneOptions={['正式']}
        themeOptions={[]}
        emotionOptions={[]}
        selectedTone={state.tone}
        selectedTheme={state.theme}
        selectedEmotion={state.emotion}
        onChange={setState}
      />
    </>
  )
}

describe('ClassifyFilter', () => {
  test('toggles selection by clicking the same option', () => {
    render(<Wrapper />)
    const option = screen.getByText('正式')
    fireEvent.click(option)
    expect(screen.getByTestId('tone-val').textContent).toBe('正式')
    fireEvent.click(option)
    expect(screen.getByTestId('tone-val').textContent).toBe('')
  })

  test('does not render clear button', () => {
    render(<Wrapper />)
    expect(screen.queryByText('清除')).toBeNull()
  })
})

