import React, { useMemo } from 'react'

function StatsPanel({
  links = [],
  tagCounts = {},
  position = 'top-right',
  compact = false,
  hidden = false,
}) {
  const weeklyCount = useMemo(() => {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    return links.filter(l => {
      const t = l?.createdAt ? new Date(l.createdAt).getTime() : NaN
      return Number.isFinite(t) && t >= weekAgo
    }).length
  }, [links])

  const totalCount = links.length

  const uniqueTagCount = useMemo(() => Object.keys(tagCounts).length, [tagCounts])

  const topTags = useMemo(
    () => Object.entries(tagCounts).sort((a, b) => b[1] - a[1]).slice(0, 5),
    [tagCounts]
  )

  // 位置樣式（僅完整版需要容器）
  const containerClasses = position === 'footer'
    ? 'bg-white shadow rounded p-4 w-full'
    : 'bg-white shadow rounded p-4 md:w-64 md:ml-auto'

  // 外部要求不顯示
  if (hidden) return null

  // Compact：三枚統計膠囊
  // Use blue for the weekly count and gray for totals to avoid confusion with tag chips
  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
          本週新增：{weeklyCount}
        </span>
        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
          總連結：{totalCount}
        </span>
        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
          標籤總數：{uniqueTagCount}
        </span>
      </div>
    )
  }

  // Full panel
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

