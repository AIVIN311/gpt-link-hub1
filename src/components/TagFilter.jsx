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

  const handleClear = () => {
    if (onChange) onChange([])
  }

  return (
    <div>
      {/* 工具列：永遠顯示清除按鈕，無選取時灰化且不可點 */}
      <div className="flex items-center gap-2 mb-1">
        <span data-testid="selected-count">已選 {selected.length} 個標籤</span>
        <button
          type="button"
          onClick={handleClear}
          className={`text-sm ${
            selected.length === 0
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-blue-500 hover:underline'
          }`}
          data-testid="clear-selection"
          disabled={selected.length === 0}
        >
          清除
        </button>
      </div>

      {/* 標籤 chips */}
      <div className="flex flex-wrap gap-2 mt-1">
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
    </div>
  )
}

export default TagFilter

