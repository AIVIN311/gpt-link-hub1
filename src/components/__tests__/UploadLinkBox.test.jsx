import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
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

  test('shows suggested tags from API and allows toggling selection', async () => {
    render(<UploadLinkBox onAdd={vi.fn()} />)

    // 觸發建議產生
    fireEvent.change(
      screen.getByPlaceholderText('自訂標題（可留空）'),
      { target: { value: 'AI GPT content' } }
    )

    // 建議區塊出現
    const suggestionBox = await screen.findByTestId('suggested-tags')
    expect(suggestionBox).toBeInTheDocument()

    // 預設為選取（藍色）
    const aiButton = within(suggestionBox).getByText('AI')
    expect(aiButton).toHaveClass('bg-blue-500')

    // 點一下切換為未選取（灰色）
    fireEvent.click(aiButton)
    await waitFor(() => {
      expect(aiButton).not.toHaveClass('bg-blue-500')
      expect(aiButton).toHaveClass('bg-gray-200')
    })
  })
})

