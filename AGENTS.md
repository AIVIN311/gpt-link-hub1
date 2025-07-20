---

# 🤖 AGENTS.md

**GPT-Link Hub 代理人任務架構文件**
版本：v1.0
更新時間：2025-07-20

---

## 🧭 概述

本平台為聚合、分類、展示使用者主動公開的 AI 聊天連結而設計，為提升平台智能化與可擴展性，架構中引入多個「AI 任務代理人（Agents）」，用以模組化處理內容檢查、分類標籤、關鍵字萃取、推薦排序、風險控管等核心任務。

以下列出各代理人名稱、職責與未來擴展計畫。

---

## 🧠 Agent 角色總覽

| 代號                | 名稱        | 功能                                          | 狀態               |
| ----------------- | --------- | ------------------------------------------- | ---------------- |
| `ValidatorAgent`  | 驗證代理人     | 驗證使用者貼上的連結是否為**公開分享連結**，避免私密內容誤傳。           | ✅ 已實作            |
| `MetaAgent`       | 元資料擷取代理人  | 自動從連結中萃取標題、描述、語言、平台（如 ChatGPT、Claude）等資訊。   | ✅ 基本版            |
| `ClassifierAgent` | 主題分類代理人   | 將對話自動歸類至主題（例：科技、哲學、行銷、創作、情感等）               | 🔄 開發中           |
| `SummarizerAgent` | 摘要代理人     | 擷取出對話精華摘要、亮點、結尾提問等，用於預覽展示。                  | 🔄 可接 GPT API 擴充 |
| `FilterAgent`     | 風險過濾代理人   | 過濾不當內容（個資、仇恨言論、敏感詞、暴力描述等），並標註風險分數。          | ✅ 初版已接 GPT       |
| `TaggerAgent`     | 標籤代理人     | 自動產出 3～7 個內容標籤（#AI寫作、#人生哲學、#GPT答題等）供搜尋與瀏覽使用 | 🔜 計劃中           |
| `RankerAgent`     | 排序代理人     | 根據熱門程度、留言、收藏、時效等多指標計算推薦順序。                  | 🔜 尚未實作          |
| `ConsentAgent`    | 同意驗證代理人   | 檢查是否勾選了「我確認此為可公開內容」等使用者聲明欄位。                | ✅ 基本已接 UI        |
| `RefinerAgent`    | 精煉與格式化代理人 | 對過長的內容斷句、加標題、切段落，提升可讀性。                     | 🔄 內測中           |

### 進度概覽

目前程式碼僅包含 `ValidatorAgent` 與 `MetaAgent`。其他代理人尚未實作，只在文件中規劃。

---

## 🧩 使用流程

1. **使用者提交對話連結**
2. `ValidatorAgent` 驗證連結格式與平台合法性
3. `ConsentAgent` 確認使用者同意聲明
4. `MetaAgent` 萃取基本資訊（標題、來源、時間）
5. `ClassifierAgent` 分析主題
6. `SummarizerAgent` 摘取摘要（摘要不公開內容）
7. `FilterAgent` 掃描違規敏感片段
8. `TaggerAgent` 自動產生 #標籤
9. `RankerAgent` 計算推薦度
10. `RefinerAgent` 整理展示格式與斷行

→ 資料進入展示頁，供使用者瀏覽、點擊、分享。

---

## 🌐 Agent 間互動圖（簡化）

```
[User Submit] 
     ↓
[Validator] ──┬──> [Consent]
              ↓
         [Meta] ──> [Classifier]
                      ↓
        [Summarizer] → [Tagger]
                      ↓
        [Filter] ─────┘
              ↓
        [Ranker + Refiner] 
              ↓
          [Final JSON]
```

---

## 🛠️ 技術說明

* **語意分析模型**：採用 GPT-4o / Claude 3 Opus API 呼叫，針對分類與摘要進行 few-shot prompting。
* **後端設計**：使用 Node.js + Express 或 Next.js Server Actions 控制 Agent Pipeline。
* **資料格式**：每個代理人對應一個獨立模組與 JSON 輸出，標準結構如下：

```json
{
  "agent": "ClassifierAgent",
  "input": "https://chat.openai.com/share/xxx",
  "output": {
    "topic": "未來科技",
    "subtopics": ["AI倫理", "GPT應用"]
  }
}
```

---

## 🚀 未來規劃

| 模組                | 擴展方向                                   |
| ----------------- | -------------------------------------- |
| `ClassifierAgent` | 引入自訓練語意分類模型（可支援中文）                     |
| `TaggerAgent`     | 增加社群標籤共創機制（tag crowdsourcing）          |
| `RankerAgent`     | 融合 PageView、使用者反應、時間熱度等綜合排序            |
| 所有 Agent          | 遷移至 Worker Queue 並進行 async pipeline 處理 |

---

## 💬 註記

> 本平台之 Agent 系統並非為了取代人類判斷，而是協助減輕重複性工作、提升分類與展示效率。我們尊重每一段分享的背後心意，亦設有舉報與下架機制，保護創作者與使用者的智慧財產與尊嚴。

---

如果你想我幫你：

* 把這些拆成 `.ts` 模組草稿
* 加入 API 串接示意
* 寫成完整 docs 文件、Readme 子頁

隨時說「幫我生成 agent 程式架構」，我立刻安排 🛠️

---

## 🛠️ 開發者指引

### 必要檢查

- 提交 PR 前請執行 `npm run lint` 並確保無錯誤。

### Commit Message Style

- 以 `type: 簡短描述` 方式撰寫，例如 `feat: 新增分享頁面`。
- 使用現在形，句末無標點。

### 測試指引

- 若新增測試，請在提交前執行 `npm test`。
- 目前專案僅需確認 `npm run dev` 能正常啟動。
