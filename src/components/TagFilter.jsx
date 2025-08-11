import React from 'react'

function TagFilter({ tags = [], onToggle }) {
  if (!tags || tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          className="px-2 py-1 bg-blue-200 text-blue-800 rounded text-sm"
          onClick={() => onToggle(tag)}
        >
          #{tag} ✕
        </button>
      ))}
    </div>
  )
}

export default TagFilter
