import React from 'react'

function LinkCard({
  title,
  description,
  summary,
  tags = [],
  url,
  onSelect,
  onDelete,
  selected = false,
}) {
  const displayTitle = title || '未命名'
  const displayTags = tags?.length > 0 ? tags : ['未分類']

  // 清理 HTML 編碼與雜訊符號（避免 description 出現亂碼）
  const cleanText = (htmlString) => {
    const div = document.createElement('div')
    div.innerHTML = htmlString
    return div.textContent || div.innerText || ''
  }

  return (
    <div
      className="bg-white p-2 md:p-4 rounded-lg shadow relative space-y-2 cursor-pointer text-sm md:text-base"
      onClick={onSelect}
    >
      {/* 刪除按鈕（若有） */}
      {onDelete && (
        <button
          className="absolute top-2 right-2 text-red-500"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(url)
          }}
        >
          🗑️
        </button>
      )}

      {/* 標題 */}
      <h2 className="text-xl font-semibold text-black">{displayTitle}</h2>

      {/* 描述（已清理） */}
      {description && (
        <p className="text-gray-700 whitespace-pre-line">
          {cleanText(description)}
        </p>
      )}

      {/* 標籤 */}
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

      {/* Summary 直接顯示 */}
      {summary && (
        <div className="bg-gray-100 text-gray-800 p-3 mt-2 rounded text-sm whitespace-pre-line">
          {summary}
        </div>
      )}

      {/* 外部連結 */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center md:inline-block mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        前往連結
      </a>
      {summary && (
        <div
          className={`pointer-events-none absolute inset-0 flex items-center justify-center bg-black bg-opacity-60 text-white text-xs p-4 rounded-lg transition-opacity duration-500 ${selected ? 'opacity-100' : 'opacity-0'}`}
        >
          {selected && <p>{summary}</p>}
        </div>
      )}
    </div>
  )
}

export default LinkCard
// LinkCard.jsx
// 用於顯示連結卡片的組件