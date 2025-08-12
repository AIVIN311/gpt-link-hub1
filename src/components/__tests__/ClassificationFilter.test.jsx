import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import ClassificationFilter from '../ClassificationFilter.jsx'

function Wrapper() {
  const [platform, setPlatform] = React.useState('')
  const [language, setLanguage] = React.useState('')
  return (
    <>
      <span data-testid="vals">{`${platform}-${language}`}</span>
      <ClassificationFilter
        platforms={['ChatGPT', 'Claude']}
        languages={['en', 'zh']}
        selectedPlatform={platform}
        selectedLanguage={language}
        onPlatformChange={setPlatform}
        onLanguageChange={setLanguage}
      />
    </>
  )
}

describe('ClassificationFilter', () => {
  test('changes platform and language selections', () => {
    render(<Wrapper />)
    fireEvent.change(screen.getByTestId('platform-filter'), { target: { value: 'ChatGPT' } })
    fireEvent.change(screen.getByTestId('language-filter'), { target: { value: 'zh' } })
    expect(screen.getByTestId('vals').textContent).toBe('ChatGPT-zh')
  })
})
