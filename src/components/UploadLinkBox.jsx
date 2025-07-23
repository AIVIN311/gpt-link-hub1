import { useState } from 'react';

export default function UploadLinkBox({ onAdd }) {
  const [link, setLink] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = () => {
    if (!link.trim()) return;

    const tagList = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t);

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
    <div className="bg-white p-4 rounded shadow space-y-3 w-full max-w-md">
      <input
        className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-500"
        placeholder="貼上公開分享連結"
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />
      <input
        className="w-full border rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="自訂標題（可留空）"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="w-full border rounded px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="標籤（以逗號分隔，例如 ChatGPT, 分類A）"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <button
        className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleSubmit}
      >
        新增
      </button>
    </div>
  );
}
