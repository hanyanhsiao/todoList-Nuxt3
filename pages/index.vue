<template>
  <div>
    <header class="app-header">
      <h1>{{ $t('title') }}</h1>
      <div class="header-controls">
        <button @click="toggleCategoryManager" class="settings-btn">
          {{ showCategoryManager ? $t('hide') : $t('manage')
          }}{{ $t('category') }}
        </button>
        <button
          @click="toggleLanguage"
          class="language-btn"
          :title="locale === 'zh' ? 'Switch to English' : '切換到中文'"
        >
          {{ locale === 'zh' ? 'EN' : '中文' }}
        </button>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <!-- 載入狀態 -->
        <div v-if="loading" class="loading">
          <div class="loading-spinner"></div>
          <p>{{ $t('loading') }}</p>
        </div>

        <!-- 錯誤訊息 -->
        <div v-if="error" class="error">
          <p>{{ error }}</p>
          <button @click="loadData" class="retry-btn">{{ $t('retry') }}</button>
        </div>

        <template v-if="!loading && !error">
          <!-- 分類管理面板 -->
          <CategoryManager
            v-if="showCategoryManager"
            :categories="state.categories"
            :todos-count="todosCountByCategory"
            @add-category="addCategory"
            @update-category="updateCategory"
            @delete-category="deleteCategory"
          />

          <!-- 新增待辦事項 -->
          <TodoInput :categories="state.categories" @add-todo="addTodo" />

          <!-- 篩選與搜尋 -->
          <TodoFilter
            :categories="state.categories"
            :current-filter="state.filter"
            :current-category="state.selectedCategory"
            :search-query="searchQuery"
            :stats="todoStats"
            @update-filter="setFilter"
            @update-category="setSelectedCategory"
            @update-search="(query: string) => (searchQuery = query)"
          />

          <!-- 待辦事項列表 -->
          <TodoList
            :todos="filteredTodos"
            :categories="state.categories"
            @update-todo="updateTodo"
            @delete-todo="deleteTodo"
            @toggle-todo="toggleTodo"
          />
        </template>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~/types';

import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

const {
  state,
  searchQuery,
  loading,
  error,
  filteredTodos,
  todoStats,
  loadData,
  addTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
  addCategory,
  deleteCategory,
  setFilter,
  setSelectedCategory,
} = useTodos();

const showCategoryManager = ref(false);

// 頁面載入時自動載入資料
onMounted(async () => {
  await loadData();
});

const todosCountByCategory = computed(() => {
  return state.todos.reduce((count, todo) => {
    count[todo.category] = (count[todo.category] || 0) + 1;
    return count;
  }, {} as Record<string, number>);
});

const updateCategory = (id: string, updates: Partial<Category>) => {
  const categoryIndex = state.categories.findIndex((cat) => cat.id === id);
  if (categoryIndex !== -1) {
    state.categories[categoryIndex] = {
      ...state.categories[categoryIndex],
      ...updates,
    };
  }
};

const toggleCategoryManager = () => {
  showCategoryManager.value = !showCategoryManager.value;
};

const toggleLanguage = () => {
  locale.value = locale.value === 'zh' ? 'en' : 'zh';
};
</script>

<style scoped>
.app-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 20px 0;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px 24px;
}

.app-header h1 {
  color: white;
  font-size: 28px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.header-controls {
  display: flex;
  gap: 12px;
  align-items: center;
}

.settings-btn,
.language-btn {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(10px);
}

.settings-btn:hover,
.language-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.language-btn {
  min-width: 50px;
  font-weight: 600;
}

.main-content {
  padding: 40px 24px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.loading {
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.8);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading p {
  font-size: 16px;
  margin: 0;
}

.error {
  text-align: center;
  padding: 40px 20px;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 12px;
  margin-bottom: 24px;
}

.error p {
  color: #fca5a5;
  font-size: 16px;
  margin-bottom: 16px;
}

.retry-btn {
  padding: 10px 20px;
  background: rgba(220, 38, 38, 0.2);
  color: #fca5a5;
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.retry-btn:hover {
  background: rgba(220, 38, 38, 0.3);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    gap: 12px;
  }

  .app-header h1 {
    font-size: 24px;
  }

  .header-controls {
    order: 2;
  }

  .main-content {
    padding: 24px 16px;
  }
}
</style>
