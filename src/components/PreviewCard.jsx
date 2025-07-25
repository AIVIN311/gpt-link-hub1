import React, { useEffect, useState } from 'react'

function PreviewCard({ title, description, summary, tags = [], url }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setVisible(true), 0)
    return () => clearTimeout(id)
  }, [])

  const displayTitle = title || '未命名'
  const displayText = summary || description
  const displayTags = Array.isArray(tags) && tags.length > 0 ? tags : ['未分類']

  return (
    <div
      className={`bg-white p-4 rounded-lg shadow space-y-2 transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <h2 className="text-xl font-semibold text-black">{displayTitle}</h2>
      {displayText && (
        <p className="text-gray-700 whitespace-pre-line">{displayText}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {displayTags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
          >
            #{tag}
          </span>
        ))}
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        前往連結
      </a>
    </div>
  )
}

export default PreviewCard
