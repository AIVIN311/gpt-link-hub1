import React, { useState, useEffect, useMemo, useRef } from 'react'
import Header from '../components/Header.jsx'
import UploadLinkBox from '../components/UploadLinkBox.jsx'
import LinkCard from '../components/LinkCard.jsx'
import PreviewCard from '../components/PreviewCard.jsx'
import TagFilter from '../components/TagFilter.jsx'
import SummarizerAgent from '../agents/SummarizerAgent.js'
import Sortable from 'sortablejs'

// === 可見性旗標：MyLinks 視為個人頁（非公開）時才顯示統計 ===
// 若之後要走環境變數，改成：const IS_PUBLIC = import.meta.env.VITE_PUBLIC_VIEW === 'true'
const IS_PUBLIC = false

// 只有在非公開模式才懶載入 StatsPanel
const LazyStatsPanel = !IS_PUBLIC
  ? React.lazy(() => import('../components/StatsPanel.jsx'))
  : null

const USER_ID_KEY = 'userUuid'

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

// 正規化每一筆資料結構
function normalizeItem(data, userId) {
  return {
    id: data.id || generateItemId(),
    url: data.url || data.link,
    title: data.title || '未命名',
    tags: Array.isArray(data.tags) ? data.tags : [],
    platform: data.platform || 'Unknown',
    language: data.language || 'unknown',
    description: data.description || '',
    createdBy: data.createdBy || userId,
    createdAt: data.createdAt || new Date().toISOString(),
  }
}

function MyLinks() {
  const summarizer = useMemo(() => new SummarizerAgent(), [])
  const [links, setLinks] = useState([])
  const [tagCounts, setTagCounts] = useState({})
  const [selectedLink, setSelectedLink] = useState(null)
  const [userId, setUserId] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const listRef = useRef(null)

  const availableTags = useMemo(
    () => Object.keys(tagCounts),
    [tagCounts]
  )

  const buildTagCounts = items => {
    const counts = {}
    for (const l of items) if (Array.isArray(l.tags)) for (const t of l.tags) counts[t] = (counts[t] || 0) + 1
    return counts
  }

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

  // 初始化使用者 ID
  useEffect(() => {
    let uid = localStorage.getItem(USER_ID_KEY)
    if (!uid) {
      uid = generateUserId()
      localStorage.setItem(USER_ID_KEY, uid)
    }
    setUserId(uid)
  }, [])

  // 啟用拖曳排序
  useEffect(() => {
    if (!listRef.current) return
    const sortable = new Sortable(listRef.current, {
      animation: 150,
      onEnd: ({ oldIndex, newIndex }) => {
        setLinks(prev => {
          const updated = [...prev]
          const [moved] = updated.splice(oldIndex, 1)
          updated.splice(newIndex, 0, moved)
          localStorage.setItem('links', JSON.stringify(updated))
          return updated
        })
      }
    })
    return () => sortable.destroy()
  }, [])

  // 載入/規範化/摘要化資料，並只保留自己建立的連結
  useEffect(() => {
    if (!userId) return

    const processItems = async (items, save = false) => {
      let changed = false
      const normalized = await Promise.all(
        items.map(async (item) => {
          const updated = normalizeItem(item, userId)
          if (!item.createdAt) changed = true
          if (!updated.summary) {
            try {
              const result = await summarizer.run(updated.url)
              updated.summary = result.summary
              changed = true
            } catch (err) {
              console.warn('Summarizer failed for stored link', err)
              updated.summary = '（暫無摘要）'
            }
          }
          return updated
        })
      )

      const mine = normalized.filter(l => l.createdBy === userId)
      if (changed || save) {
        localStorage.setItem('links', JSON.stringify(normalized))
      }
      setLinks(mine)
      setTagCounts(buildTagCounts(mine))
    }

    const stored = localStorage.getItem('links')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          processItems(parsed)
        } else {
          setLinks([])
        }
      } catch (e) {
        console.error('Failed to parse links from localStorage', e)
        setLinks([])
      }
    } else {
      setLinks([])
    }
  }, [userId, summarizer])

  // 新增連結
  async function handleAdd(data) {
    const base = normalizeItem(data, userId)
    let summary = ''
    try {
      const result = await summarizer.run(base.url)
      summary = result.summary
    } catch (err) {
      console.warn('Summarizer failed when adding link', err)
      summary = '（暫無摘要）'
    }
    const item = { ...base, summary, createdAt: base.createdAt }

    increaseTagCounts(item.tags)
    setLinks(prev => {
      const next = [...prev, item]
      const stored = localStorage.getItem('links')
      const all = stored ? JSON.parse(stored) : []
      localStorage.setItem('links', JSON.stringify([...all, item]))
      return next
    })
  }

  // 刪除連結
  function handleDelete(id) {
    setLinks(prev => {
      const target = prev.find(item => item.id === id)
      const next = prev.filter(item => item.id !== id)
      const stored = localStorage.getItem('links')
      const all = stored ? JSON.parse(stored).filter(l => l.id !== id) : []
      localStorage.setItem('links', JSON.stringify(all))
      if (target) decreaseTagCounts(target.tags)
      return next
    })
    if (selectedLink?.id === id) setSelectedLink(null)
  }

  // 點擊標籤 → 篩選
  function handleTagSelect(tag) {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  function renderListItem(link) {
    return (
      <LinkCard
        key={link.id}
        {...link}
        selected={selectedLink && selectedLink.id === link.id}
        onSelect={() => setSelectedLink(link)}
        onDelete={() => handleDelete(link.id)}
        onTagSelect={handleTagSelect}
      />
    )
  }

  const filteredLinks = useMemo(() => {
    if (selectedTags.length === 0) return links
    return links.filter(link => selectedTags.every(tag => link.tags.includes(tag)))
  }, [links, selectedTags])

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
            <UploadLinkBox onAdd={handleAdd} />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  已選 {selectedTags.length} 個
                </span>
                {selectedTags.length > 0 && (
                  <button
                    className="text-sm text-blue-500 hover:underline"
                    onClick={() => setSelectedTags([])}
                  >
                    清除
                  </button>
                )}
              </div>

              <TagFilter
                tags={availableTags}
                selected={selectedTags}
                mode="multi"
                onChange={setSelectedTags}
              />
            </div>

            <div className="space-y-6" ref={listRef}>
              {filteredLinks.length > 0 ? (
                filteredLinks.map(link => renderListItem(link))
              ) : (
                <p className="text-center text-gray-500">尚無連結，請貼上新網址</p>
              )}
            </div>
          </div>

          <div className="w-full md:w-5/12 md:sticky md:top-24 self-start mt-6 md:mt-0">
            {selectedLink ? (
              <PreviewCard {...selectedLink} onTagSelect={handleTagSelect} />
            ) : (
              <div className="bg-gray-100 text-gray-500 flex items-center justify-center h-full p-6 rounded">
                請選擇一個連結以預覽
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyLinks


