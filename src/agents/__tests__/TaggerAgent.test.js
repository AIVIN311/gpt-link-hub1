import { describe, expect, test } from 'vitest'
import TaggerAgent from '../TaggerAgent.js'

describe('TaggerAgent', () => {
  test('returns expected tags for sample text', () => {
    const agent = new TaggerAgent()
    const { tags } = agent.run('This GPT-based AI tool is on YouTube')
    expect(tags).toEqual(['ChatGPT', 'AI', '影音'])
  })
})
