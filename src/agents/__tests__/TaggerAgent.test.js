import { describe, expect, test } from 'vitest'
import TaggerAgent from '../TaggerAgent.js'

describe('TaggerAgent', () => {
  test('returns tags for sample text', async () => {
    const agent = new TaggerAgent()
    const { tags } = await agent.run('This GPT-based AI tool is on YouTube')
    expect(Array.isArray(tags)).toBe(true)
    expect(tags.length).toBeGreaterThan(0)
  })
})
