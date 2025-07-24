import React, { useState, useEffect, useMemo } from 'react'
import Header from '../components/Header.jsx'
import UploadLinkBox from '../components/UploadLinkBox.jsx'
import LinkCard from '../components/LinkCard.jsx'
import PreviewCard from '../components/PreviewCard.jsx'
import SummarizerAgent from '../agents/SummarizerAgent.js'

const USER_ID_KEY = 'userUuid'

const SAMPLE_LINKS = [
  {
    title: '示範連結 1',
    description: '範例對話描述',
    tags: ['ChatGPT', '示範'],
    url: 'https://chat.openai.com/share/example-1',
  },
  {
    title: '示範連結 2',
    description: '另外一個對話範例',
    tags: ['AI', '分享'],
    url: 'https://chat.openai.com/share/example-2',
  },
]

// 產生唯一項目 ID
function generateItemId() {
  if (crypto?.randomUUID) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

// 產生使用者 ID（若瀏覽器支援則用 UUID）
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
  }
}

function Explore() {
  const summarizer = useMemo(() => new SummarizerAgent(), [])
  const [links, setLinks] = useState([])
  const [selectedLink, setSelectedLink] = useState(null)
  const [userId, setUserId] = useState('')

  // ✨ 第一次載入時，初始化 userId
  useEffect(() => {
    let uid = localStorage.getItem(USER_ID_KEY)
    if (!uid) {
      uid = generateUserId()
      localStorage.setItem(USER_ID_KEY, uid)
    }
    setUserId(uid)
  }, [])

  // 🚀 當 userId 有值後，讀取 localStorage，若無資料則載入範例連結
  useEffect(() => {
    if (!userId) return

    const processItems = async (items, save = false) => {
      let changed = false
      const normalized = await Promise.all(
        items.map(async (item) => {
          let updated = normalizeItem(item, userId)

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

      if (changed || save) {
        localStorage.setItem('links', JSON.stringify(normalized))
      }
      setLinks(normalized)
    }

    const stored = localStorage.getItem('links')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length > 0) {
          processItems(parsed)
        } else {
          processItems(SAMPLE_LINKS, true)
        }
      } catch (e) {
        console.error('Failed to parse links from localStorage', e)
        processItems(SAMPLE_LINKS, true)
      }
    } else {
      processItems(SAMPLE_LINKS, true)
    }
  }, [userId, summarizer])

  // ➕ 使用者貼上新連結
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

    const item = { ...base, summary }

    setLinks((prev) => {
      const next = [...prev, item]
      localStorage.setItem('links', JSON.stringify(next))
      return next
    })
  }

  // ❌ 刪除連結
  function handleDelete(id) {
    setLinks((prev) => {
      const next = prev.filter((item) => item.id !== id)
      localStorage.setItem('links', JSON.stringify(next))
      return next
    })

    if (selectedLink && selectedLink.id === id) {
      setSelectedLink(null)
    }
  }

  // 🧩 渲染每一筆連結卡片
  function renderListItem(link) {
    const allowDelete = link.createdBy === userId
    return (
      <LinkCard
        key={link.id}
        {...link}
        selected={selectedLink && selectedLink.id === link.id}
        onSelect={() => setSelectedLink(link)}
        onDelete={allowDelete ? handleDelete : undefined}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-start px-6 py-8 overflow-x-hidden">
      <div className="container mx-auto px-4 space-y-6">
        <Header />
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/2 space-y-6">
            <UploadLinkBox onAdd={handleAdd} />
            <div className="space-y-6">
              {links.length > 0 ? (
                links.map((link) => renderListItem(link))
              ) : (
                <p className="text-center text-gray-500">尚無連結，請貼上新網址</p>
              )}
            </div>
          </div>
          <div className="w-full md:w-1/2 mt-6 md:mt-0">
            {selectedLink ? (
              <PreviewCard {...selectedLink} />
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

export default Explore
