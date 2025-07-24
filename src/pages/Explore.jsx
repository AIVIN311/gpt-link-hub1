import React, { useState, useEffect, useMemo } from 'react'
import Header from '../components/Header.jsx'
import UploadLinkBox from '../components/UploadLinkBox.jsx'
import LinkCard from '../components/LinkCard.jsx'
import SummarizerAgent from '../agents/SummarizerAgent.js'

const USER_ID_KEY = 'userUuid'

// 產生使用者 ID（若瀏覽器支援則用 UUID）
function generateUserId() {
  if (crypto?.randomUUID) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

// 正規化每一筆資料結構
function normalizeItem(data, userId) {
  return {
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

  // 🚀 當 userId 有值後，讀取 localStorage 裡的連結並補上 summary
  useEffect(() => {
    if (!userId) return

    const stored = localStorage.getItem('links')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        let changed = false

        const fillSummaries = async () => {
          const normalized = await Promise.all(
            parsed.map(async (item) => {
              let updated = { ...item }

              if (!updated.createdBy) {
                updated.createdBy = userId
                changed = true
              }

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

          if (changed) {
            localStorage.setItem('links', JSON.stringify(normalized))
          }
          setLinks(normalized)
        }

        fillSummaries()
      } catch (e) {
        console.error('Failed to parse links from localStorage', e)
      }
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
      const next = prev.filter((item) => item.url !== id)
      localStorage.setItem('links', JSON.stringify(next))
      return next
    })

    if (selectedLink && selectedLink.url === id) {
      setSelectedLink(null)
    }
  }

  // 🧩 渲染每一筆連結卡片
  function renderListItem(link) {
    const allowDelete = link.createdBy === userId
    return (
      <LinkCard
        key={link.url}
        {...link}
        selected={selectedLink?.url === link.url}
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
              <LinkCard {...selectedLink} selected />
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
