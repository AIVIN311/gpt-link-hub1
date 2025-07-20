# GPT Link Hub

GPT Link Hub is an open-source portal for collecting and exploring public AI chat links from services such as ChatGPT, Claude and Gemini. It aims to preserve useful conversations and make them easy to browse by topic.

## Setup

```bash
npm install       # install dependencies
npm run dev       # start local development server
npm run build     # create a production build
npm run preview   # preview the build
npm run docs      # build the documentation site
```

## Documentation

The documentation site lives in the `docs` folder. Run `npm run docs` to generate the static files in `docs/.vitepress/dist`.

## Usage

1. Run `npm run dev` and open `http://localhost:5173` in your browser.
2. Paste a shareable conversation link into the form.
3. Browse or search the shared links by category and tags.

Enjoy exploring the collective knowledge of AI conversations!
# 🌐 GPT-Link Hub

**收集、分類、探索全世界公開 AI 對話連結的分享平台**

> 「把人類與 AI 的對話智慧，轉化為一座座可再探訪的燈塔。」

---

## 📌 什麼是 GPT-Link Hub？

**GPT-Link Hub** 是一個開源平台，用來**聚合與分類使用者主動公開的 ChatGPT / Claude / Gemini 等 AI 聊天連結**。
我們相信這些對話中蘊含著：

* **解決問題的巧思**
* **創作靈感的火花**
* **靈性覺醒的痕跡**
* **人類與 AI 共創的新型智慧流**

這些都值得被珍藏、分類、分享與再探索。

---

## ✨ 主要功能特色

* 🔍 **分類瀏覽**：透過主題分類（如哲學、創作、技術、心理、日常等）快速尋找感興趣的對話。
* 🏷️ **自動標籤與摘要**：每段對話會由 AI 自動加上主題標籤與摘要。
* 🔗 **安全連結驗證**：僅收錄使用者主動公開的分享連結。
* 📄 **多平台支援**：目前支援 ChatGPT、Claude、Gemini、Perplexity 等平台。
* 🧠 **智慧代理人支援**：後台有多個 AI Agents 處理分類、過濾、排序等工作（詳見 `AGENTS.md`）。

---

## 🚀 快速開始

1. **安裝相依套件**

```bash
npm install
```

2. **啟動開發伺服器**

```bash
npm run dev
```

3. **打開網站**

預設網址為：

```
http://localhost:5173
```

---

## 🏗️ 專案架構

```
gpt-link-hub/
│
├─ public/             # 靜態資源
├─ src/
│   ├─ pages/          # 主頁面與動態頁
│   ├─ components/     # 共用元件（如卡片、Tag、Modal）
│   ├─ agents/         # AI 任務代理人模組（分類、摘要、驗證等）
│   ├─ lib/            # 公用函式與工具
│   └─ styles/         # Tailwind 與自訂樣式
│
├─ tailwind.config.js  # Tailwind 設定檔
├─ postcss.config.js   # PostCSS 設定檔
├─ AGENTS.md           # AI 模組說明文件
└─ README.md           # 專案說明
```

---

## 🛡️ 使用者與隱私權聲明

* 本平台**僅收錄使用者手動貼上且確認願意公開**的聊天連結。
* 所有內容皆標註來源與平台，不修改原始對話。
* 若發現有誤收或需下架之內容，歡迎回報或聯絡我們。

---

## 📌 路線圖（Roadmap）

| 階段   | 功能                      | 狀態     |
| ---- | ----------------------- | ------ |
| v1.0 | 支援貼上 GPT 對話連結 + 分類展示    | ✅ 完成   |
| v1.1 | 自動標籤、摘要、風險掃描            | 🔄 開發中 |
| v1.2 | 收藏功能 + 用戶瀏覽紀錄           | 🔜 計畫中 |
| v2.0 | 使用者個人頁 + 私人分享清單         | 🚧 研究中 |
| v2.5 | GPT 自動回顧功能：「你可能也會喜歡的對話」 | 🧪 構思中 |

---

## 🙋‍♀️ 如何貢獻

1. 點選右上角 `Fork`
2. 建立一個新分支並命名（如：`feature/new-agent`）
3. 提交你的變更並發送 Pull Request
4. 我們會盡快回覆並整合 ❤️

---

## 🤝 聯絡我 / 加入開發者社群

想一起建構這座「AI 對話圖書館」嗎？
歡迎來信、私訊、發起合作，或直接在 Issues 中留言！

---

## 📄 授權 License

本專案採用 **MIT License**，歡迎自由使用、改作、分享。

---

如需更進一步自動化功能（例如 auto pull ChatGPT 分享連結、RSS 訂閱 GPT 筆記等），我可以幫你設計 plugin 或 agent 延伸架構，歡迎接著說「幫我設計自動同步模組」我們就繼續打造 🚀
