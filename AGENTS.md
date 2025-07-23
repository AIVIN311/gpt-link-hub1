# 🤖 AGENTS.md

**GPT-Link Hub 代理人任務架構文件**  
版本：v1.1  
更新時間：2025-07-23

---

## 🧭 概述

本平台為聚合、分類、展示使用者主動公開的 AI 聊天連結而設計，為提升平台智能化與可擴展性，架構中引入多個「AI 任務代理人（Agents）」，用以模組化處理內容驗證、分類標籤、關鍵字萃取、推薦排序、風險控管等核心任務。

---

## 🧠 Agent 角色總覽

| 代號                | 名稱        | 功能                                          | 狀態與備註                             |
|---------------------|-------------|-----------------------------------------------|----------------------------------------|
| `ValidatorAgent`    | 驗證代理人     | 驗證貼上的連結是否為「公開可分享」格式                | ✅ 已實作，已對應 `validator.task.json` |
| `MetaAgent`         | 元資料擷取代理人  | 萃取標題、平台、語言、日期等基本資料                   | ✅ 已實作，已對應 `metaExtractor.task.json` |
| `ConsentAgent`      | 同意驗證代理人   | 檢查是否勾選「我確認此為可公開內容」等聲明              | ✅ 前端驗證完成，後端已對應表單欄位        |
| `ClassifierAgent`   | 主題分類代理人   | 將對話歸類至主題（如 AI、哲學、創作、行銷等）           | 🔧 任務已規劃，Codex 執行中                |
| `SummarizerAgent`   | 摘要代理人     | 擷取精華摘要、亮點片段、結尾提問，用於預覽與 SEO 展示      | 🔄 草稿開發中，GPT few-shot 接入預備        |
| `TaggerAgent`       | 標籤代理人     | 自動產生 3～7 個內容標籤（#AI寫作、#GPT答題 等）       | 🟡 尚未開發，任務已規劃                     |
| `FilterAgent`       | 風險過濾代理人   | 掃描不當內容並給予風險等級（個資、仇恨、暴力、色情等）      | ✅ 初版完成，GPT-4 API 接入                  |
| `RankerAgent`       | 排序代理人     | 根據熱門程度、收藏、留言、時效等多指標排序             | 🟠 排序邏輯未建置，預計接 log 系統            |
| `RefinerAgent`      | 精煉代理人     | 斷句、排版、加標題等格式優化，提升閱讀體驗               | 🔄 內測中，可配合 Summarizer 後處理         |

---

## 🪄 Codex 任務對應表

| Agent             | 任務檔名                    | 任務類型          | 優先級 |
|------------------|-----------------------------|-------------------|--------|
| ValidatorAgent   | `validator.task.json`       | URL 驗證           | 🔥 高   |
| MetaAgent        | `metaExtractor.task.json`   | 頁面解析           | ✅ 已完成 |
| ConsentAgent     | 無（由 UI 控制表單）           | 前端驗證           | ✅ 已完成 |
| ClassifierAgent  | `classifier.task.json`      | 主題分類           | 🟡 中   |
| SummarizerAgent  | `summarizer.task.json`      | GPT 摘要           | 🟡 中   |
| TaggerAgent      | `tagger.task.json`          | 標籤生成           | 🟠 低   |
| FilterAgent      | `filter.task.json`          | 敏感詞 + GPT 分析    | ✅ 已完成 |
| RankerAgent      | `ranker.task.json`          | 熱度排序計算       | 🔵 延後開發 |
| RefinerAgent     | `refiner.task.json`         | 格式調整與轉換       | 🟢 中   |

---

## 🛠️ 技術說明

- **前端框架**：Vite + React + TailwindCSS  
- **後端架構**：Node.js + Express 或 Next.js Edge Functions  
- **API 路由格式**：`POST /api/agent/{agentName}`  
- **AI 模型介接**：GPT-4o / Claude 3 Opus，支援 few-shot 提示設計  
- **資料格式標準**（各 Agent 輸出）：

```json
{
  "agent": "SummarizerAgent",
  "input": "https://chat.openai.com/share/xxx",
  "output": {
    "summary": "這段對話討論了 AI 在教育上的應用，強調了人機協作的重要性。",
    "highlight": ["AI 教學", "共學", "教育轉型"],
    "question": "AI 是否可能取代老師的角色？"
  }
}
🧬 Codex 執行原則
每個 Agent 需對應一個獨立任務 JSON，包含 input, expected_output, fallback。

Codex 可依據此檔自動建立 dev pipeline。

Agent 任務允許 Pre → Core → Post 多階段處理。

可串接 worker queue 或 async pipeline 處理大量連結。

🧪 API 測試方式
測試 MetaAgent
bash
複製
編輯
curl -X POST http://localhost:3000/api/agent/meta \
  -H "Content-Type: application/json" \
  -d '{"url": "https://chat.openai.com/share/xyz123"}'
測試 ClassifierAgent（尚需實作）
bash
複製
編輯
curl -X POST http://localhost:3000/api/agent/classifier \
  -H "Content-Type: application/json" \
  -d '{"content": "這是一段關於 AI 教學與語言模型的對話..."}'
📊 使用流程（全平台處理鏈）
使用者貼上分享連結

ValidatorAgent 檢查連結有效性

ConsentAgent 確認使用者授權公開

MetaAgent 抓取標題、平台、日期等元資訊

ClassifierAgent 分析主題與分類

SummarizerAgent 提煉摘要與亮點片段

FilterAgent 過濾不當詞彙與標記違規

TaggerAgent 自動產出標籤（hash tag）

RankerAgent 計算展示推薦排序

RefinerAgent 最終整理格式與排版

→ 最終生成 displayData.json → 對應 UI 卡片呈現

🌐 Agent 任務流程圖（更新版）
css
複製
編輯
[User Submit] 
     ↓
[Validator] ──┬──> [Consent]
              ↓
         [Meta] ──> [Classifier]
                        ↓
       [Summarizer] → [Tagger]
                        ↓
         [Filter] ──────┘
              ↓
        [Ranker + Refiner] 
              ↓
          [Final JSON]
🚀 未來規劃
模組	發展方向
ClassifierAgent	自訓練語意分類模型（中文 BERT / Mixtral）
TaggerAgent	社群標籤共創（Tag Crowdsourcing）
RankerAgent	接入 GA / Firestore 回饋紀錄進行熱度排序
所有 Agent	遷移至 AgentWorkerQueue 進行 async pipeline

💬 註記
本平台之 Agent 系統旨在協助使用者分類、摘要與篩選公開聊天資料，非用於侵犯個人隱私或評價創作者本身。每段對話皆可舉報或隱藏，尊重每位分享者的智慧與選擇權。

📜 更新紀錄
v1.0：初版撰寫，定義各 Agent 功能與流程

v1.1：加入 Codex 任務索引、API 測試、模組對應檔案、流程更新圖與前後端整合說明

## 🛠️ 開發者指引

### 必要檢查

- 提交 PR 前請執行 `npm run lint` 並確保無錯誤。

### Commit Message Style

- 以 `type: 簡短描述` 方式撰寫，例如 `feat: 新增分享頁面`。
- 使用現在形，句末無標點。

### 測試指引

- 若新增測試，請在提交前執行 `npm test`。
- 目前專案僅需確認 `npm run dev` 能正常啟動。
