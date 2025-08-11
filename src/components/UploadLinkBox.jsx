import { useEffect, useState } from 'react';

export default function UploadLinkBox({ onAdd }) {
  const [link, setLink] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const handler = setTimeout(async () => {
      if (!link.trim() && !title.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const res = await fetch('/api/agent/tagger', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: link.trim(), title: title.trim() }),
          signal: controller.signal,
        });
        const data = await res.json();
        if (Array.isArray(data.tags)) {
          setSuggestions(data.tags.map((tag) => ({ tag, selected: true })));
        }
      } catch (err) {
        console.error(err)
      }
    }, 500);

    return () => {
      clearTimeout(handler);
      controller.abort();
    };
  }, [link, title]);

  const handleSubmit = () => {
    if (!link.trim()) return;

    const tagList = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t);

    suggestions.forEach((s) => {
      if (s.selected && !tagList.includes(s.tag)) {
        tagList.push(s.tag);
      }
    });

    onAdd({
      url: link.trim(),
      title: title.trim(),
      tags: tagList,
    });

    // 清空欄位
    setLink('');
    setTitle('');
    setTags('');
    setSuggestions([]);
  };

  const toggleSuggestion = (index) => {
    setSuggestions((prev) =>
      prev.map((s, i) => (i === index ? { ...s, selected: !s.selected } : s)),
    );
  };

  return (
    <div className="bg-white p-3 md:p-4 rounded shadow space-y-3 w-full max-w-md text-sm md:text-base">
      <input
        className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="貼上公開分享連結"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />
      <input
        className="w-full bg-black text-white border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="自訂標題（可留空）"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="w-full bg-black text-white border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="標籤（以逗號分隔，例如 ChatGPT, 分類A）"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s, idx) => (
            <button
              key={s.tag}
              type="button"
              onClick={() => toggleSuggestion(idx)}
              className={`px-2 py-1 rounded-full border text-sm ${
                s.selected
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              {s.tag}
            </button>
          ))}
        </div>
      )}
      <button
        className="w-full bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        新增
      </button>
    </div>
  );
}
