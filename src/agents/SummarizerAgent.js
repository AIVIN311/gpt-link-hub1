export default class SummarizerAgent {
  constructor(options = {}) {
    this.options = options
  }

  async run(link) {
    try {
      const res = await fetch(link)
      const html = await res.text()
      const og = html.match(/<meta[^>]*property=['"]og:description['"][^>]*content=['"]([^'"]+)['"][^>]*>/i)
      const desc = html.match(/<meta[^>]*name=['"]description['"][^>]*content=['"]([^'"]+)['"][^>]*>/i)
      let summary = ''
      if (og) summary = og[1]
      else if (desc) summary = desc[1]
      if (!summary) {
        const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
        summary = text.slice(0, 160)
      }
      return { summary }
    } catch {
      return { summary: '' }
    }
  }
}
