import { describe, expect, test } from 'vitest'
import TaggerAgent from '../TaggerAgent.js'

describe('TaggerAgent', () => {
  test('returns relevant tags for sample text', async () => {
    const agent = new TaggerAgent()
    const { tags } = await agent.run('This GPT-based AI tool is on YouTube')

    // 應該要回傳陣列，數量介於 1~7（預設 limit）
    expect(Array.isArray(tags)).toBe(true)
    expect(tags.length).toBeGreaterThan(0)
    expect(tags.length).toBeLessThanOrEqual(7)

    // 不比對完整相等，只要求包含關鍵詞（大小寫不敏感）
    const lower = new Set(tags.map(t => t.toLowerCase()))
    expect(lower.has('gpt')).toBe(true)
    expect(lower.has('youtube')).toBe(true)
  })

  test('applies keywordMap normalization when provided', async () => {
    const agent = new TaggerAgent({ keywordMap: { gpt: 'ChatGPT' } })
    const { tags } = await agent.run('Gpt tricks on youtube')
    const lower = new Set(tags.map(t => t.toLowerCase()))
    // 映射後我們會標準化為小寫 → 'chatgpt'
    expect(lower.has('chatgpt')).toBe(true)
  })

  test('respects custom limit', async () => {
    const agent = new TaggerAgent()
    const { tags } = await agent.run({ content: 'react react prompt gpt youtube ai tool', limit: 3 })
    expect(tags.length).toBeLessThanOrEqual(3)
  })
})
