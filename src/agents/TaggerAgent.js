/**
 * Generates 3-7 relevant tags from a link or text content
 */
export default class TaggerAgent {
  constructor(options = {}) {
    this.options = options
    this.stopwords = new Set([
      'the','and','for','are','with','that','this','from','https','http','com',
      'www','you','your','but','not','have','has','was','were','will','would',
      'can','could','should','shall','they','their','them','his','her','she',
      'him','our','ours','about','into','over','under','after','before','when',
      'where','who','what','which','why','how','all','any','both','each','few',
      'more','most','other','some','such','no','nor','too','very'
    ])
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

    text = (text || '').toLowerCase().replace(/[\n\r]+/g, ' ')
    const words = text
      .replace(/[^\p{L}\p{N} ]+/gu, ' ')
      .split(/\s+/)
      .filter(w => w && w.length > 2 && !this.stopwords.has(w))

    if (!words.length) return { tags: [] }

    const freq = new Map()
    for (const w of words) {
      freq.set(w, (freq.get(w) || 0) + 1)
    }
    const tags = [...freq.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([w]) => w)
      .slice(0, 7)

    return { tags }
  }
}
