import React from 'react'

function LinkCard({ title, description, summary, tags = [], url, onSelect, onDelete }) {
  const displayTitle = title || '未命名'
  const displayTags = tags?.length > 0 ? tags : ['未分類']

  return (
    <div
      className="bg-white p-2 md:p-4 rounded-lg shadow relative space-y-2 cursor-pointer text-sm md:text-base group"
      onClick={onSelect}
    >
      {onDelete && (
        <button
          className="absolute top-2 right-2 text-red-500 hover:text-red-700"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(url)
          }}
        >
          🗑️
        </button>
      )}
      <h2 className="text-xl font-semibold text-black">{displayTitle}</h2>
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
        className="block w-full text-center md:inline-block md:w-auto mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        前往連結
      </a>
      {summary && (
        <div className="pointer-events-none absolute inset-0 hidden group-hover:flex items-center justify-center bg-black bg-opacity-60 text-white text-xs p-4 rounded-lg">
          <p>{summary}</p>
        </div>
      )}
    </div>
  )
}

export default LinkCard
