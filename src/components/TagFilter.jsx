import React from 'react'

function TagFilter({ tags = [], selected = [], onChange, mode = 'multi' }) {
  function handleClick(tag) {
    if (!onChange) return
    if (mode === 'single') {
      if (selected.includes(tag)) onChange([])
      else onChange([tag])
    } else {
      if (selected.includes(tag)) onChange(selected.filter((t) => t !== tag))
      else onChange([...selected, tag])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => {
        const active = selected.includes(tag)
        return (
          <button
            key={tag}
            type="button"
            onClick={() => handleClick(tag)}
            className={`px-2 py-1 rounded text-sm ${
              active ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-800'
            }`}
          >
            #{tag}
          </button>
        )
      })}
    </div>
  )
}

export default TagFilter
