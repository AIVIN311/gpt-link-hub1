import React, { useState, useEffect } from 'react'
import Header from '../components/Header.jsx'
import UploadLinkBox from '../components/UploadLinkBox.jsx'
import LinkCard from '../components/LinkCard.jsx'
import PreviewCard from '../components/PreviewCard.jsx'

const USER_ID_KEY = 'userUuid'

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
  const [links, setLinks] = useState([
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
  ])
  const [selectedLink, setSelectedLink] = useState(null)
  const [userId, setUserId] = useState('')

  useEffect(() => {
    let uid = localStorage.getItem(USER_ID_KEY)
    if (!uid) {
      uid = crypto.randomUUID()
      localStorage.setItem(USER_ID_KEY, uid)
    }
    setUserId(uid)
    const stored = localStorage.getItem('links')
    if (stored) {
      try {
        setLinks(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to parse links from localStorage', e)
      }
    }
  }, [])

  function handleAdd(data) {
    setLinks((prev) => {
      const next = [...prev, normalizeItem(data, userId)]
      localStorage.setItem('links', JSON.stringify(next))
      return next
    })
  }

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

  function renderListItem(link) {
    const allowDelete = link.createdBy === userId
    return (
      <LinkCard
        key={link.url}
        {...link}
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
                <p className="text-center text-gray-500">Loading...</p>
              )}
            </div>
          </div>
          <div className="w-full md:w-1/2 mt-6 md:mt-0">
            {selectedLink ? (
              <LinkCard {...selectedLink} />
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
