export default function cleanText(input = '') {
  const withBreaks = input
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
  const stripped = withBreaks.replace(/<[^>]+>/g, '')
  const entities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' '
  }
  return stripped.replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (m) => entities[m])
}
