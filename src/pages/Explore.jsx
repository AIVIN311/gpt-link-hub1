import React, { useState } from 'react'
import Header from '../components/Header.jsx'
import UploadLinkBox from '../components/UploadLinkBox.jsx'
import LinkCard from '../components/LinkCard.jsx'

function normalizeItem(data) {
  return {
    url: data.url || data.link,
    title: data.title || '未命名',
    tags: Array.isArray(data.tags) ? data.tags : [],
    platform: data.platform || 'Unknown',
    language: data.language || 'unknown',
    description: data.description || '',
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

  function handleAdd(data) {
    setLinks((prev) => [...prev, normalizeItem(data)])
  }

  function renderListItem(link) {
    return <LinkCard key={link.url} {...link} />
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 flex justify-center items-start">
      <div className="w-full max-w-screen-md space-y-6">
        <Header />
        <UploadLinkBox onAdd={handleAdd} />
        <div className="space-y-4">
          {links.length > 0 ? (
            links.map((link) => renderListItem(link))
          ) : (
            <p className="text-center text-gray-500">Loading...</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Explore
