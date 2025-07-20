/**
 * Extracts basic metadata from a conversation link
 */

export default class MetaAgent {
  constructor(options = {}) {
    this.options = options
  }

  async run(link) {
    const platform = link.includes('chat.openai.com') ? 'ChatGPT' : 'Unknown'
    let title = 'Untitled Chat'
    try {
      const res = await fetch(link)
      const html = await res.text()
      const og = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["'][^>]*>/i)
      if (og) {
        title = og[1]
      } else {
        const t = html.match(/<title>([^<]*)<\/title>/i)
        if (t) title = t[1]
      }
    } catch {
      /* ignore fetch errors */
    }
    const language = 'unknown'
    return { title, platform, language }
  }
}
