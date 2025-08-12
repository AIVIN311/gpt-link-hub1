import React from 'react'
import TagFilter from './TagFilter.jsx'
import { TONE_OPTIONS, THEME_OPTIONS, EMOTION_OPTIONS } from '../constants.js'

function ClassifyFilter({
  toneOptions = TONE_OPTIONS,
  themeOptions = THEME_OPTIONS,
  emotionOptions = EMOTION_OPTIONS,
  selectedTones = [],
  selectedThemes = [],
  selectedEmotions = [],
  onTonesChange,
  onThemesChange,
  onEmotionsChange
}) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="mb-1">語氣</h4>
        <TagFilter
          tags={toneOptions}
          selected={selectedTones}
          onChange={onTonesChange}
          mode="multi"
        />
      </div>
      <div>
        <h4 className="mb-1">主題</h4>
        <TagFilter
          tags={themeOptions}
          selected={selectedThemes}
          onChange={onThemesChange}
          mode="multi"
        />
      </div>
      <div>
        <h4 className="mb-1">情緒</h4>
        <TagFilter
          tags={emotionOptions}
          selected={selectedEmotions}
          onChange={onEmotionsChange}
          mode="multi"
        />
      </div>
    </div>
  )
}

export default ClassifyFilter
