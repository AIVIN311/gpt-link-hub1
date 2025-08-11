import { useEffect, useState } from 'react';

export default function UploadLinkBox({ onAdd }) {
  const [link, setLink] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [suggested, setSuggested] = useState([]);

  useEffect(() => {
    const text = `${title} ${link}`.trim();
    if (!text) {
      setSuggested([]);
      return;
    }
    let ignore = false;
    (async () => {
      try {
        const res = await fetch('/api/agent/tagger', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });
        const data = await res.json();
        if (!ignore && Array.isArray(data.tags)) setSuggested(data.tags);
      } catch {
        if (!ignore) setSuggested([]);
      }
    })();
    return () => {
      ignore = true;
    };
  }, [link, title]);

  const handleAddTag = (tag) => {
    const current = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t);
    if (!current.includes(tag)) {
      current.push(tag);
      setTags(current.join(', '));
    }
  };

  const handleSubmit = () => {
    if (!link.trim()) return;

    const tagList = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t);

    const keywordMap = {
      GPT: 'ChatGPT',
      AI: 'AI',
      YouTube: '影音',
    };

    const text = `${title} ${link}`.toLowerCase();
    Object.entries(keywordMap).forEach(([keyword, suggested]) => {
      if (text.includes(keyword.toLowerCase()) && !tagList.includes(suggested)) {
        tagList.push(suggested);
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
      {suggested.length > 0 && (
        <div data-testid="suggested-tags" className="flex flex-wrap gap-2">
          {suggested.map((tag) => (
            <button
              type="button"
              key={tag}
              className="bg-gray-200 text-sm px-2 py-1 rounded"
              onClick={() => handleAddTag(tag)}
            >
              {tag}
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
