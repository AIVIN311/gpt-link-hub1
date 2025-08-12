import React from 'react'

function ClassificationFilter({
  platforms = [],
  languages = [],
  selectedPlatform = '',
  selectedLanguage = '',
  onPlatformChange,
  onLanguageChange,
}) {
  return (
    <div className="flex gap-4 mb-2">
      <select
        value={selectedPlatform}
        onChange={(e) => onPlatformChange?.(e.target.value)}
        className="border rounded p-1"
        data-testid="platform-filter"
      >
        <option value="">全部平台</option>
        {platforms.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <select
        value={selectedLanguage}
        onChange={(e) => onLanguageChange?.(e.target.value)}
        className="border rounded p-1"
        data-testid="language-filter"
      >
        <option value="">全部語言</option>
        {languages.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ClassificationFilter
