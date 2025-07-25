/**
 * Generates a short summary from a link or text content
 */
export default class SummarizerAgent {
  constructor(options = {}) {
    this.options = options
  }

  async run({ link, content } = {}) {
    let text = content || ''

    if (link && !text) {
      try {
        const res = await fetch(link)
        const html = await res.text()
        const noScripts = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
        const noStyles = noScripts.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
        text = noStyles.replace(/<[^>]*>/g, ' ')
      } catch {
        // ignore fetch errors
      }
    }

    text = (text || '').replace(/\s+/g, ' ').trim()
    if (!text) return { summary: '' }

    const sentences = text.match(/[^.!?]+[.!?]/g) || [text]
    const summary = sentences.slice(0, 3).join(' ').trim()
    return { summary }
  }
}
