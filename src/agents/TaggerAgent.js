/**
 * Generates 3–7 relevant tags from link or text, with optional keyword mapping.
 * - Heuristic frequency + lightweight CJK tokenization
 * - Optional keywordMap to force/normalize certain tags
 * - Optional HTML fetch (disabled by default to avoid CORS / latency)
 */
export default class TaggerAgent {
  constructor(options = {}) {
    const {
      keywordMap = {},          // e.g. { gpt: 'ChatGPT', ai: 'AI', youtube: '影音' }
      blacklist = ['示範','範例','test','http','https','www'],
      allowFetch = false,       // true 才會嘗試抓取 url 文字
      defaultLimit = 7,
    } = options

    this.options = { keywordMap, blacklist: new Set(blacklist), allowFetch, defaultLimit }

    // 英文停用詞
    this.stopwords = new Set([
      'the','and','for','are','with','that','this','from','https','http','com','www','you','your',
      'but','not','have','has','was','were','will','would','can','could','should','shall',
      'they','their','them','his','her','she','him','our','ours','about','into','over','under',
      'after','before','when','where','who','what','which','why','how','all','any','both',
      'each','few','more','most','other','some','such','no','nor','too','very'
    ])
  }

  /**
   * 相容舊版：run('pure text')；新版：run({ title, description, summary, url, content, limit })
   * 回傳：{ tags: string[] }
   */
  async run(input = {}) {
    // --- 參數歸一化 ---
    let title = '', description = '', summary = '', url = '', content = '', limit
    if (typeof input === 'string') {
      content = input
    } else {
      ({ title = '', description = '', summary = '', url = '', content = '', limit } = input)
    }
    const maxTags = Math.max(3, Math.min(Number(limit) || this.options.defaultLimit, 12))

    // --- 決定要分析的文字 ---
    let text = [title, description, summary, content].filter(Boolean).join(' ')
    if (!text && url && this.options.allowFetch) {
      try {
        const res = await fetch(url)
        const html = await res.text()
        const noScripts = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
        const noStyles  = noScripts.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
        text = noStyles.replace(/<[^>]*>/g, ' ')
      } catch (e) {
        // 忽略 fetch 失敗；維持空字串
      }
    }

    // 沒有可分析文字就回空
    if (!text || !text.trim()) return { tags: [] }

    // --- Tokenize ---
    const lower = text.toLowerCase().replace(/[\n\r]+/g, ' ')
    // 英數詞
    const enTokens = lower.replace(/[^\p{L}\p{N} ]+/gu, ' ')
                          .split(/\s+/)
                          .filter(w => w && w.length > 2 && !this.stopwords.has(w))
    // 簡易 CJK 連續詞（2~5 字）
    const cjkTokens = (text.match(/[\u4e00-\u9fa5]{2,5}/g) || [])

    // --- 頻率累計（標題權重 3x，summary 2x，描述 1x）---
    const freq = new Map()
    const bump = (token, score = 1) => {
      const cur = freq.get(token) || 0
      freq.set(token, cur + score)
    }

    const addWeighted = (source, weight) => {
      for (const t of source) bump(t, weight)
    }

    addWeighted(enTokens, 1)
    addWeighted(cjkTokens, 1)
    // 針對標題/摘要再加權
    if (title) {
      const titleEn = title.toLowerCase().match(/[a-z0-9]{3,}/g) || []
      const titleCjk = title.match(/[\u4e00-\u9fa5]{2,5}/g) || []
      addWeighted(titleEn, 3); addWeighted(titleCjk, 3)
    }
    if (summary) {
      const sumEn = summary.toLowerCase().match(/[a-z0-9]{3,}/g) || []
      const sumCjk = summary.match(/[\u4e00-\u9fa5]{2,5}/g) || []
      addWeighted(sumEn, 2); addWeighted(sumCjk, 2)
    }

    // --- keywordMap 規範化（同義合併 / 強化詞）---
    // e.g. gpt4o -> gpt -> ChatGPT
    const normFreq = new Map()
    for (const [tok, sc] of freq.entries()) {
      const mapped = this.options.keywordMap[tok] || tok
      normFreq.set(mapped, (normFreq.get(mapped) || 0) + sc)
    }

    // --- 清理與排序 ---
    let arr = [...normFreq.entries()]
      .filter(([k]) =>
        k &&
        k.length >= 2 &&
        !/^\d+$/.test(k) &&
        !this.options.blacklist.has(k)
      )
      .sort((a, b) => b[1] - a[1])
      .map(([k]) => k)

    // 去重 & 標準化大小寫（英文小寫、中文原樣）
    arr = Array.from(new Set(arr)).map(t => /[a-z]/i.test(t) ? t.toLowerCase() : t)

    // --- 回傳（3–7 或指定 limit）---
    return { tags: arr.slice(0, maxTags) }
  }
}
