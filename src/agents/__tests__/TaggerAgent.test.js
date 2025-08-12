import { describe, expect, test, vi } from 'vitest'
import TaggerAgent from '../TaggerAgent.js'

describe('TaggerAgent', () => {
  test('returns relevant tags for sample text', async () => {
    const agent = new TaggerAgent()
    const { tags } = await agent.run('This GPT-based AI tool is on YouTube')

    // 應該回傳陣列、數量合理
    expect(Array.isArray(tags)).toBe(true)
    expect(tags.length).toBeGreaterThan(0)
    expect(tags.length).toBeLessThanOrEqual(7)

    // 不比對完整相等，只要求包含關鍵詞（大小寫不敏感）
    const lower = new Set(tags.map(t => t.toLowerCase()))
    expect(lower.has('gpt')).toBe(true)
    expect(lower.has('youtube')).toBe(true)
  })

  test('applies keywordMap normalization when provided (gpt→ChatGPT, youtube→影音)', async () => {
    const agent = new TaggerAgent({ keywordMap: { gpt: 'ChatGPT', youtube: '影音' } })
    const { tags } = await agent.run('This GPT-based AI tool is on YouTube')
    const lower = new Set(tags.map(t => t.toLowerCase()))
    // 英文會被小寫化：ChatGPT -> chatgpt；中文維持原樣：影音
    expect(lower.has('chatgpt')).toBe(true)
    expect(tags).toContain('影音')
  })

  test('respects custom limit', async () => {
    const agent = new TaggerAgent()
    const { tags } = await agent.run({ content: 'react react prompt gpt youtube ai tool', limit: 3 })
    expect(tags.length).toBeLessThanOrEqual(3)
  })

  test('accepts link as alias for url when fetching content', async () => {
    const html = '<div>GPT tool on YouTube</div>'
    const originalFetch = globalThis.fetch
    globalThis.fetch = vi.fn().mockResolvedValue({ text: () => Promise.resolve(html) })
    const agent = new TaggerAgent({ allowFetch: true })
    const { tags } = await agent.run({ link: 'http://example.com/mock' })
    const lower = new Set(tags.map(t => t.toLowerCase()))
    expect(lower.has('gpt')).toBe(true)
    expect(lower.has('youtube')).toBe(true)
    globalThis.fetch = originalFetch
  })
})

