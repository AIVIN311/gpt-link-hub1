import { describe, expect, test } from 'vitest'
import TaggerAgent from '../TaggerAgent.js'

describe('TaggerAgent', () => {
  test('returns normalized tags for sample text', async () => {
    const agent = new TaggerAgent({ keywordMap: { gpt: 'ChatGPT', youtube: '影音' } })
    const { tags } = await agent.run('This GPT-based AI tool is on YouTube')
    expect(tags).toContain('chatgpt')
    expect(tags).toContain('影音')
  })
})
