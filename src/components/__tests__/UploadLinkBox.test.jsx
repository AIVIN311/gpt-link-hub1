import { render, screen, fireEvent } from '@testing-library/react'
import UploadLinkBox from '../UploadLinkBox.jsx'
import { vi } from 'vitest'

describe('UploadLinkBox tag suggestions', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ tags: ['AI', 'ChatGPT'] }),
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('shows suggested tags from API and allows adding them', async () => {
    render(<UploadLinkBox onAdd={vi.fn()} />)
    fireEvent.change(
      screen.getByPlaceholderText('自訂標題（可留空）'),
      { target: { value: 'AI GPT content' } }
    )

    const suggestionBox = await screen.findByTestId('suggested-tags')
    expect(suggestionBox).toBeInTheDocument()
    fireEvent.click(screen.getByText('AI'))
    expect(
      screen.getByPlaceholderText('標籤（以逗號分隔，例如 ChatGPT, 分類A）').value
    ).toContain('AI')
  })
})
