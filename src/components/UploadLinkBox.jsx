import React, { useState } from 'react'

function UploadLinkBox({ onAdd }) {
  const [link, setLink] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!link) return

    try {
      console.log('Submitting link', link)
      const res = await fetch('/api/validate-meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link }),
      })
      if (!res.ok) throw new Error('Request failed')
      const data = await res.json()
      console.log('Response', data)
      if (onAdd) onAdd(data)
      setLink('')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
      <input
        type="url"
        required
        placeholder="貼上公開分享連結"
        className="flex-grow p-2 border rounded"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        新增
      </button>
    </form>
  )
}

export default UploadLinkBox
