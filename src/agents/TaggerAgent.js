/**
 * Generates tags based on simple keyword matching
 */
export default class TaggerAgent {
  constructor(options = {}) {
    this.options = options
    this.keywordMap = {
      gpt: 'ChatGPT',
      ai: 'AI',
      youtube: '影音',
      ...options.keywordMap,
    }
  }

  run(text = '') {
    const tags = []
    const lower = text.toLowerCase()
    for (const [keyword, tag] of Object.entries(this.keywordMap)) {
      if (lower.includes(keyword.toLowerCase()) && !tags.includes(tag)) {
        tags.push(tag)
      }
    }
    return { tags }
  }
}
