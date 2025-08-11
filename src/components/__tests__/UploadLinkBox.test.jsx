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

  test('shows suggested tags from API and allows toggling them', async () => {
    render(<UploadLinkBox onAdd={vi.fn()} />)
    fireEvent.change(
      screen.getByPlaceholderText('自訂標題（可留空）'),
      { target: { value: 'AI GPT content' } }
    )

    const suggestionBox = await screen.findByTestId('suggested-tags')
    expect(suggestionBox).toBeInTheDocument()
    const aiBtn = screen.getByText('AI')
    expect(aiBtn.className).toContain('bg-blue-500')
    fireEvent.click(aiBtn)
    expect(aiBtn.className).toContain('bg-gray-200')
  })
})
