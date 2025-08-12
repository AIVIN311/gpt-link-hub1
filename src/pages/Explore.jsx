import React, { useState, useEffect, useMemo, useRef } from 'react'
import Header from '../components/Header.jsx'
import UploadLinkBox from '../components/UploadLinkBox.jsx'
import LinkCard from '../components/LinkCard.jsx'
import PreviewCard from '../components/PreviewCard.jsx'
import TagFilter from '../components/TagFilter.jsx'
import SummarizerAgent from '../agents/SummarizerAgent.js'
import ClassifyFilter from '../components/ClassifyFilter.jsx'

// === 可見性旗標：公開視圖不顯示統計（之後要改可從環境變數或設定注入）===
const IS_PUBLIC = true

// 只有在非公開模式才懶載入 StatsPanel，避免多餘 bundle
const LazyStatsPanel = !IS_PUBLIC
  ? React.lazy(() => import('../components/StatsPanel.jsx'))
  : null

const USER_ID_KEY = 'userUuid'

const SAMPLE_LINKS = [
  { title: '示範連結 1', description: '範例對話描述', tags: ['ChatGPT', '示範'], url: 'https://chat.openai.com/share/example-1' },
  { title: '示範連結 2', description: '另外一個對話範例', tags: ['AI', '分享'], url: 'https://chat.openai.com/share/example-2' },
]

// 產生唯一項目 ID
function generateItemId() {
  if (crypto?.randomUUID) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

// 產生使用者 ID
function generateUserId() {
  if (crypto?.randomUUID) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

// 正規化資料
function normalizeItem(data, userId) {
  return {
    id: data.id || generateItemId(),
    url: data.url || data.link,
    title: data.title || '未命名',
    tags: Array.isArray(data.tags) ? data.tags : [],
    tone: data.tone || '',
    theme: data.theme || '',
    emotion: data.emotion || '',
    platform: data.platform || 'Unknown',
    language: data.language || 'unknown',
    description: data.description || '',
    tone: data.tone ?? null,
    theme: data.theme ?? null,
    emotion: data.emotion ?? null,
    createdBy: data.createdBy || userId,
    createdAt: data.createdAt || new Date().toISOString(),
  }
}

function Explore() {
  const summarizer = useMemo(() => new SummarizerAgent(), [])
  const [links, setLinks] = useState([])
  const [tagCounts, setTagCounts] = useState({})
  const [selectedLink, setSelectedLink] = useState(null)
  const [userId, setUserId] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [classify, setClassify] = useState({ tone: null, theme: null, emotion: null })
  const uploadRef = useRef(null)

  const availableTags = useMemo(
    () => Object.keys(tagCounts),
    [tagCounts]
  )
  const toneOptions = useMemo(() => Array.from(new Set(links.map(l => l.tone).filter(Boolean))), [links])
  const themeOptions = useMemo(() => Array.from(new Set(links.map(l => l.theme).filter(Boolean))), [links])
  const emotionOptions = useMemo(() => Array.from(new Set(links.map(l => l.emotion).filter(Boolean))), [links])

  const buildTagCounts = items => {
    const counts = {}
    for (const l of items) if (Array.isArray(l.tags)) for (const t of l.tags) counts[t] = (counts[t] || 0) + 1
    return counts
  }

  // TODO: add tone/theme/emotion counts when classification is enabled

  const increaseTagCounts = tags => {
    setTagCounts(prev => {
      const next = { ...prev }
      for (const t of tags) next[t] = (next[t] || 0) + 1
      return next
    })
  }

  const decreaseTagCounts = tags => {
    setTagCounts(prev => {
      const next = { ...prev }
      for (const t of tags) {
        if (next[t] > 1) next[t] -= 1
        else delete next[t]
      }
      return next
    })
  }

  // 初始化使用者
  useEffect(() => {
    let uid = localStorage.getItem(USER_ID_KEY)
    if (!uid) {
      uid = generateUserId()
      localStorage.setItem(USER_ID_KEY, uid)
    }
    setUserId(uid)
  }, [])

  // 載入/規範化資料，無資料時放入示例
  useEffect(() => {
    if (!userId) return

    const processItems = async (items, save = false) => {
      let changed = false
      const normalized = await Promise.all(
        items.map(async (item) => {
          const updated = normalizeItem(item, userId)
          if (item.tone === undefined) { updated.tone = null; changed = true }
          if (item.theme === undefined) { updated.theme = null; changed = true }
          if (item.emotion === undefined) { updated.emotion = null; changed = true }
          if (!item.createdAt) changed = true
          if (!updated.summary) {
            try {
              const result = await summarizer.run(updated.url)
              updated.summary = result.summary
              changed = true
            } catch {
              updated.summary = '（暫無摘要）'
            }
          }
          return updated
        })
      )
      if (changed || save) localStorage.setItem('links', JSON.stringify(normalized))
      setLinks(normalized)
      setTagCounts(buildTagCounts(normalized))
    }

    const stored = localStorage.getItem('links')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        Array.isArray(parsed) && parsed.length > 0
          ? processItems(parsed)
          : processItems(SAMPLE_LINKS, true)
      } catch {
        processItems(SAMPLE_LINKS, true)
      }
    } else {
      processItems(SAMPLE_LINKS, true)
    }
  }, [userId, summarizer])

  // 新增連結
  async function handleAdd(data) {
    // tone/theme/emotion are passed through normalizeItem and persisted
    const base = normalizeItem(data, userId)
    let summary = ''
    try {
      const result = await summarizer.run(base.url)
      summary = result.summary
    } catch {
      summary = '（暫無摘要）'
    }
    const item = { ...base, summary, createdAt: base.createdAt }
    increaseTagCounts(item.tags)
    setLinks(prev => {
      const next = [...prev, item]
      localStorage.setItem('links', JSON.stringify(next))
      return next
    })
  }

  // 刪除
  function handleDelete(id) {
    setLinks(prev => {
      const target = prev.find(item => item.id === id)
      const next = prev.filter(item => item.id !== id)
      localStorage.setItem('links', JSON.stringify(next))
      if (target) decreaseTagCounts(target.tags)
      return next
    })
    if (selectedLink?.id === id) setSelectedLink(null)
  }

  // 點標籤→篩選
  function handleTagSelect(tag) {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  // 渲染卡片
  function renderListItem(link) {
    const allowDelete = link.createdBy === userId
    return (
      <LinkCard
        key={link.id}
        {...link}
        selected={selectedLink && selectedLink.id === link.id}
        onSelect={() => setSelectedLink(link)}
        onDelete={allowDelete ? handleDelete : undefined}
        onTagSelect={handleTagSelect}
      />
    )
  }

  const filteredLinks = useMemo(() => {
    return links.filter(link => {
      const tagMatch = selectedTags.every(tag => link.tags.includes(tag))
      const toneMatch = !classify.tone || link.tone === classify.tone
      const themeMatch = !classify.theme || link.theme === classify.theme
      const emotionMatch = !classify.emotion || link.emotion === classify.emotion
      return tagMatch && toneMatch && themeMatch && emotionMatch
    })
  }, [links, selectedTags, classify])

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start px-6 py-8 overflow-x-hidden">
      <div className="container mx-auto px-4 space-y-6">
        <div className="flex justify-between items-start">
          <Header />
          {!IS_PUBLIC && LazyStatsPanel && (
            <React.Suspense fallback={null}>
              <LazyStatsPanel links={links} tagCounts={tagCounts} compact />
            </React.Suspense>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-7/12 space-y-6">
            <UploadLinkBox onAdd={handleAdd} ref={uploadRef} />

            <div className="mt-2">
              <ClassifyFilter
                toneOptions={toneOptions}
                themeOptions={themeOptions}
                emotionOptions={emotionOptions}
                selectedTone={classify.tone}
                selectedTheme={classify.theme}
                selectedEmotion={classify.emotion}
                onChange={setClassify}
              />

              <TagFilter
                tags={availableTags}
                selected={selectedTags}
                mode="multi"
                onChange={setSelectedTags}
              />
            </div>

            <div className="space-y-6">
              {filteredLinks.length > 0
                ? filteredLinks.map(renderListItem)
                : <p className="text-center text-gray-500">尚無連結，請貼上新網址</p>}
            </div>
          </div>

          <div className="w-full md:w-5/12 mt-6 md:mt-2 md:sticky md:top-28 self-start">
            {selectedLink
              ? <PreviewCard {...selectedLink} onTagSelect={handleTagSelect} />
              : (
                <div className="bg-gray-100 text-gray-500 flex flex-col items-center justify-center h-full p-6 rounded">
                  <p className="mb-2">請選擇一個連結以預覽</p>
                  <button
                    type="button"
                    className="text-sm text-blue-500 hover:underline"
                    onClick={() => uploadRef.current?.focus()}
                  >
                    貼上連結
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Explore

