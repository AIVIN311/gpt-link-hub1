import React from 'react'

function ClassifyFilter({ toneOptions = [], themeOptions = [], emotionOptions = [], selectedTone, selectedTheme, selectedEmotion, onChange }) {
  const handleSelect = (type, value) => {
    if (!onChange) return
    const next = { tone: selectedTone, theme: selectedTheme, emotion: selectedEmotion }
    next[type] = next[type] === value ? null : value
    onChange(next)
  }

  const handleClear = (type) => {
    if (!onChange) return
    const next = { tone: selectedTone, theme: selectedTheme, emotion: selectedEmotion }
    next[type] = null
    onChange(next)
  }

  const renderGroup = (label, options, selectedValue, type) => (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-1">
        <span>{label}</span>
        <button
          type="button"
          onClick={() => handleClear(type)}
          className={`text-sm ${selectedValue ? 'text-blue-500 hover:underline' : 'text-gray-300 cursor-not-allowed'}`}
          disabled={!selectedValue}
        >
          清除
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mt-1">
        {options.map(opt => {
          const active = selectedValue === opt
          return (
            <button
              key={opt}
              type="button"
              onClick={() => handleSelect(type, opt)}
              className={`px-2 py-1 rounded text-sm ${active ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-800'}`}
            >
              {opt}
            </button>
          )
        })}
      </div>
    </div>
  )

  return (
    <div>
      {renderGroup('語氣', toneOptions, selectedTone, 'tone')}
      {renderGroup('主題', themeOptions, selectedTheme, 'theme')}
      {renderGroup('情緒', emotionOptions, selectedEmotion, 'emotion')}
    </div>
  )
}

export default ClassifyFilter

