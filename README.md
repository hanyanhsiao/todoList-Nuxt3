# TodoList Vue 3

一個使用 Vue 3 + TypeScript + Vite 構建的待辦事項應用程序。

## 功能特色

- 新增、編輯、刪除待辦事項
- 標記完成/未完成狀態
- 按類別篩選待辦事項
- 響應式設計

## 技術棧

- Vue 3
- TypeScript
- Vite
- ESLint

## 運行指令

### 安裝依賴
```bash
npm install
```

### 開發模式
```bash
npm run dev
```
啟動開發服務器，通常在 http://localhost:5173

### 構建項目
```bash
npm run build
```
構建生產版本到 `dist` 目錄

### 預覽構建結果
```bash
npm run preview
```
預覽生產構建版本

### 代碼檢查
```bash
npm run lint
```
運行 ESLint 檢查並自動修復代碼風格問題

## 項目結構

```
src/
├── components/          # Vue 組件
│   ├── CategoryManager.vue
│   ├── TodoFilter.vue
│   ├── TodoInput.vue
│   ├── TodoItem.vue
│   └── TodoList.vue
├── composables/         # 組合式函數
│   └── useTodos.ts
├── styles/             # 樣式文件
│   └── common.css
├── types/              # TypeScript 類型定義
│   └── index.ts
├── App.vue             # 根組件
└── main.ts             # 應用入口點
```