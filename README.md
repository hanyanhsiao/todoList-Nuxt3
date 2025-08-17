# TodoList Nuxt 3

一個使用 Nuxt 3 + TypeScript 構建的待辦事項應用程序，整合 JSON Server 提供 RESTful API 服務。

## 功能特色

- 新增、刪除待辦事項 (透過 API)
- 標記已完成/未完成狀態 (透過 API)
- 按類別篩選待辦事項
- 分類管理功能 (透過 API)
- 搜尋功能
- 響應式設計
- **RESTful API 整合**
- 載入狀態和錯誤處理

## 技術棧

- Nuxt 3
- Vue 3
- TypeScript
- SCSS/Sass (變數和混合)
- JSON Server (模擬 API)
- Vite (內建於 Nuxt 3)

## 運行指令

### 安裝依賴

```bash
npm install
```

### 啟動完整開發環境 (推薦)

```bash
npm run dev:full
```

這將同時啟動：

- JSON Server API 服務 (http://localhost:3002)
- Nuxt 開發服務器 (http://localhost:3000)

### 單獨啟動服務

#### 僅啟動 API 服務

```bash
npm run api
```

#### 僅啟動開發模式

```bash
npm run dev
```

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
│   └── styles/         # SCSS 樣式文件
│       ├── _variables.scss    # SCSS 變數定義
│       ├── _mixins.scss       # SCSS 混合(Mixins)
│       └── common.scss        # 共用樣式和工具類
├── components/         # Vue 組件 (自動匯入)
│   ├── CategoryManager.vue
│   ├── TodoFilter.vue
│   ├── TodoInput.vue
│   ├── TodoItem.vue
│   └── TodoList.vue
├── composables/        # 組合式函數 (自動匯入)
│   ├── useTodos.ts
│   └── useApi.ts       # API 服務層
├── layouts/            # 布局文件
│   └── default.vue
├── pages/              # 頁面路由 (File-based Routing)
│   └── index.vue
├── plugins/            # 插件
│   └── i18n.client.ts
├── public/             # 靜態資源
├── types/              # TypeScript 類型定義
│   └── index.ts
├── db.json             # JSON Server 資料庫
├── nuxt.config.ts      # Nuxt 配置
└── tsconfig.json       # TypeScript 配置
```

## API 端點

### Todo 相關

- `GET /todos` - 獲取所有待辦事項
- `POST /todos` - 創建新待辦事項
- `DELETE /todos/:id` - 刪除待辦事項

### Category 相關

- `GET /categories` - 獲取所有分類
- `POST /categories` - 創建新分類
- `DELETE /categories/:id` - 刪除分類

## 資料結構

### Todo

```typescript
interface TodoItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Category

```typescript
interface Category {
  id: string;
  name: string;
  color: string;
}
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

### 4. SCSS 架構

- **變數系統**：`_variables.scss` 定義了顏色、間距、字體等設計 token
- **混合(Mixins)**：`_mixins.scss` 提供可重用的樣式模式
- **響應式設計**：內建斷點混合，支援行動優先設計
- **實用工具類**：預定義的間距、文字對齊等工具類

#### 混合(Mixins)範例

```scss
// 卡片樣式
@include card-base;

// 按鈕變體
@include button-variant(color(primary), color(white), color(primary-hover));

// Flex 佈局
@include flex-center;
@include flex-between;

// 響應式
@include mobile {
  // 行動裝置樣式
}
```
