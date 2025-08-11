import { useEffect, useState, forwardRef } from 'react';

const UploadLinkBox = forwardRef(function UploadLinkBox({ onAdd }, ref) {
  const [link, setLink] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState(''); // 手動輸入（以逗號分隔）
  const [suggestions, setSuggestions] = useState([]); // [{ tag, selected }]

  useEffect(() => {
    const url = link.trim();
    const ttl = title.trim();

    // 若沒有任何可分析文字，清空建議
    if (!url && !ttl) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const handler = setTimeout(async () => {
      try {
        const res = await fetch('/api/agent/tagger', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, title: ttl }),
          signal: controller.signal,
        });
        const data = await res.json();

        // 兼容兩種回傳：string[] 或 {tag, selected}[]
        const arr = Array.isArray(data?.tags) ? data.tags : [];
        const normalized = arr.map((t) =>
          typeof t === 'string' ? { tag: t, selected: true } : { tag: t.tag, selected: !!t.selected }
        );

        // 去重並保留選取狀態（預設選取）
        const seen = new Set();
        const uniq = [];
        for (const s of normalized) {
          const key = (s.tag || '').trim();
          if (!key || seen.has(key)) continue;
          seen.add(key);
          uniq.push({ tag: key, selected: s.selected !== false });
        }
        setSuggestions(uniq);
      } catch {
        // 靜默失敗：清空建議避免干擾使用者
        setSuggestions([]);
        // console.error(err)
      }
    }, 500); // debounce

    return () => {
      clearTimeout(handler);
      controller.abort();
    };
  }, [link, title]);

  const toggleSuggestion = (index) => {
    setSuggestions((prev) =>
      prev.map((s, i) => (i === index ? { ...s, selected: !s.selected } : s))
    );
  };

  const handleSubmit = () => {
    const url = link.trim();
    if (!url) return;

    // 手動標籤：逗號分隔 → 去頭尾空白 → 過濾空字串
    const manual = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t);

    // 合併已選建議標籤
    const merged = [...manual];
    for (const s of suggestions) {
      if (s.selected && s.tag && !merged.includes(s.tag)) merged.push(s.tag);
    }

    onAdd({
      url,
      title: title.trim(),
      tags: merged,
    });

    // 重置表單
    setLink('');
    setTitle('');
    setTags('');
    setSuggestions([]);
  };

  return (
    <div className="bg-white p-3 md:p-4 rounded shadow space-y-3 w-full max-w-md text-sm md:text-base">
      <input
        ref={ref}
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
        <>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">建議標籤（可點選加入/取消）</span>
            <div className="space-x-2">
              <button
                type="button"
                className="text-sm text-blue-600 hover:underline"
                onClick={() =>
                  setSuggestions((prev) => prev.map((s) => ({ ...s, selected: true })))
                }
              >
                全部加入
              </button>
              <button
                type="button"
                className="text-sm text-gray-500 hover:underline"
                onClick={() =>
                  setSuggestions((prev) => prev.map((s) => ({ ...s, selected: false })))
                }
              >
                全部取消
              </button>
            </div>
          </div>

          <div data-testid="suggested-tags" className="flex flex-wrap gap-2">
            {suggestions.map((s, idx) => (
              <button
                key={s.tag}
                type="button"
                onClick={() => toggleSuggestion(idx)}
                className={`px-2 py-1 rounded-full border text-sm ${
                  s.selected ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-200 text-gray-700 border-gray-200'
                }`}
              >
                {s.tag}
              </button>
            ))}
          </div>
        </>
      )}

      <button
        className="w-full bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        新增
      </button>
    </div>
  );
});

export default UploadLinkBox;

