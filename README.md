# TodoList Nuxt 3

一個使用 Nuxt 3 + TypeScript 構建的待辦事項應用程序。

## 功能特色

- 新增、刪除待辦事項
- 標記完成/未完成狀態
- 按類別篩選待辦事項
- 分類管理功能
- 搜尋功能
- 響應式設計

## 技術棧

- Nuxt 3
- Vue 3
- TypeScript
- Vite (內建於 Nuxt 3)

## 運行指令

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

啟動開發服務器，通常在 http://localhost:3000

### 構建項目

```bash
npm run build
```

構建生產版本

### 預覽構建結果

```bash
npm run preview
```

預覽生產構建版本

### 生成靜態站點

```bash
npm run generate
```

生成靜態 HTML 文件

## 項目結構

```
├── assets/
│   └── styles/         # 樣式文件
│       └── common.css
├── components/         # Vue 組件 (自動匯入)
│   ├── CategoryManager.vue
│   ├── TodoFilter.vue
│   ├── TodoInput.vue
│   ├── TodoItem.vue
│   └── TodoList.vue
├── composables/        # 組合式函數 (自動匯入)
│   └── useTodos.ts
├── layouts/            # 布局文件
│   └── default.vue
├── pages/              # 頁面路由 (File-based Routing)
│   └── index.vue
├── public/             # 靜態資源
├── types/              # TypeScript 類型定義
│   └── index.ts
├── nuxt.config.ts      # Nuxt 配置
└── tsconfig.json       # TypeScript 配置
```

## Nuxt 3 架構特色

### 1. File-based Routing

- `pages/` 目錄下的 `.vue` 檔案自動生成路由
- 無需手動配置路由

### 2. 自動匯入

- `components/` 下的組件自動匯入，可直接使用
- `composables/` 下的函數自動匯入

### 3. 布局系統

- `layouts/` 目錄管理頁面布局
- 預設使用 `default.vue` 布局

### 4. SSR 支援

- 內建伺服器端渲染支援
- 更好的 SEO 和初始載入性能
