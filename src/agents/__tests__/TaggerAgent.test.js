import { describe, expect, test } from 'vitest'
import TaggerAgent from '../TaggerAgent.js'

describe('TaggerAgent', () => {
  test('returns expected tags for sample text', async () => {
    const agent = new TaggerAgent()
    const { tags } = await agent.run('This GPT-based AI tool is on YouTube')
    expect(tags).toEqual(['gpt', 'based', 'tool', 'youtube'])
  })
})
