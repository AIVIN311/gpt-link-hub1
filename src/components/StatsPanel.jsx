import React, { useMemo } from 'react'

function StatsPanel({ links = [], position = 'top-right' }) {
  const weeklyCount = useMemo(() => {
    const now = Date.now()
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000
    return links.filter((l) => {
      if (!l.createdAt) return false
      return new Date(l.createdAt).getTime() >= weekAgo
    }).length
  }, [links])

  const topTags = useMemo(() => {
    const counts = links.reduce((acc, link) => {
      if (Array.isArray(link.tags)) {
        link.tags.forEach((tag) => {
          acc[tag] = (acc[tag] || 0) + 1
        })
      }
      return acc
    }, {})

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
  }, [links])

  const containerClasses =
    position === 'footer'
      ? 'bg-white shadow rounded p-4 w-full'
      : 'bg-white shadow rounded p-4 md:w-64 md:ml-auto'

  return (
    <div className={containerClasses}>
      <h2 className="text-lg font-semibold mb-2">統計資訊</h2>
      <p className="mb-4">本週新增數：{weeklyCount}</p>
      <div>
        <h3 className="font-semibold mb-1">熱門標籤</h3>
        {topTags.length > 0 ? (
          <ul className="space-y-1">
            {topTags.map(([tag, count]) => (
              <li key={tag} className="flex justify-between">
                <span>{tag}</span>
                <span>{count}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">尚無標籤</p>
        )}
      </div>
    </div>
  )
}

export default StatsPanel

