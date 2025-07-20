/**
 * Extracts basic metadata from a conversation link
 */

export default class MetaAgent {
  constructor(options = {}) {
    this.options = options
  }

  run(link) {
    const platform = link.includes('chat.openai.com') ? 'ChatGPT' : 'Unknown'
    const title = 'Untitled Chat'
    const language = 'unknown'
    return { title, platform, language }
  }
}
