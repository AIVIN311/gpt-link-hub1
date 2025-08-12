export function generateItemId() {
  if (crypto?.randomUUID) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

export default function normalizeItem(data, userId) {
  return {
    id: data.id || generateItemId(),
    url: data.url || data.link,
    title: data.title || '未命名',
    tags: Array.isArray(data.tags) ? data.tags : [],
    classify: {
      tone: data.classify?.tone ?? null,
      theme: data.classify?.theme ?? null,
      emotion: data.classify?.emotion ?? null,
    },
    platform: data.platform || 'Unknown',
    language: data.language || 'unknown',
    description: data.description || '',
    createdBy: data.createdBy || userId,
    createdAt: data.createdAt || new Date().toISOString(),
  }
}
