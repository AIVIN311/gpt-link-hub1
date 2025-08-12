import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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
    const aiButton = screen.getByText('AI')
    expect(aiButton).toHaveClass('bg-blue-500')

    // 點一下切換為未選取（灰色）
    fireEvent.click(aiButton)
    await waitFor(() => {
      expect(aiButton).not.toHaveClass('bg-blue-500')
      expect(aiButton).toHaveClass('bg-gray-200')
    })
  })

  test('selecting and clearing classification chips sends classify field', () => {
    const onAdd = vi.fn()
    render(<UploadLinkBox onAdd={onAdd} />)

    fireEvent.change(
      screen.getByPlaceholderText('貼上公開分享連結'),
      { target: { value: 'http://example.com' } }
    )

    // select tone/theme/emotion
    fireEvent.click(screen.getByText('理性'))
    fireEvent.click(screen.getByText('科技'))
    fireEvent.click(screen.getByText('開心'))

    fireEvent.click(screen.getByText('新增'))
    expect(onAdd).toHaveBeenLastCalledWith(
      expect.objectContaining({ classify: { tone: '理性', theme: '科技', emotion: '開心' } })
    )

    // second submission with tone cleared
    fireEvent.change(
      screen.getByPlaceholderText('貼上公開分享連結'),
      { target: { value: 'http://example2.com' } }
    )
    const toneChip = screen.getByText('理性')
    fireEvent.click(toneChip) // select
    fireEvent.click(toneChip) // clear
    fireEvent.click(screen.getByText('新增'))
    expect(onAdd).toHaveBeenLastCalledWith(
      expect.objectContaining({ classify: { tone: null, theme: null, emotion: null } })
    )
  })
})

