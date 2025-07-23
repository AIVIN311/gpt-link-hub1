import React from 'react'

function LinkCard({ title, description, tags = [], url, onSelect }) {
  const displayTitle = title || '未命名'
  const displayTags = tags?.length > 0 ? tags : ['未分類']

  function handleKeyDown(e) {
    if (!onSelect) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(e)
    }
  }

  const baseClass = 'bg-white p-4 rounded-lg shadow space-y-2'

  return (
    <div
      className={`${baseClass}${onSelect ? ' cursor-pointer' : ''}`}
      onClick={onSelect}
      role={onSelect ? 'button' : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={onSelect ? handleKeyDown : undefined}
    >
      <h2 className="text-xl font-semibold">{displayTitle}</h2>
      <p className="text-gray-700">{description}</p>
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
        className="inline-block mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        前往連結
      </a>
    </div>
  )
}

export default LinkCard
