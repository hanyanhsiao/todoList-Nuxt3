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

<style scoped lang="scss">
@import '~/assets/styles/variables';
@import '~/assets/styles/mixins';

.app-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: spacing(lg) 0;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  @include flex-between;
  max-width: 800px;
  margin: 0 auto;
  padding: spacing(lg) spacing(lg);

  h1 {
    color: color(white);
    font-size: 28px;
    font-weight: font-weight(bold);
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
}

.header-controls {
  @include flex-start;
  gap: spacing(md);
}

.settings-btn,
.language-btn {
  padding: spacing(sm) spacing(md);
  background: rgba(255, 255, 255, 0.2);
  color: color(white);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  font-size: font-size(sm);
  cursor: pointer;
  transition: all transition(normal);
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
  }
}

.language-btn {
  min-width: 50px;
  font-weight: font-weight(semibold);
}

.main-content {
  padding: 40px spacing(lg);
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.loading {
  text-align: center;
  padding: 60px spacing(lg);
  color: rgba(255, 255, 255, 0.8);

  p {
    font-size: font-size(base);
    margin: 0;
  }
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto spacing(lg);
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

.error {
  text-align: center;
  padding: 40px spacing(lg);
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: border-radius(xlarge);
  margin-bottom: spacing(lg);

  p {
    color: #fca5a5;
    font-size: font-size(base);
    margin-bottom: spacing(md);
  }
}

.retry-btn {
  padding: 10px spacing(lg);
  background: rgba(220, 38, 38, 0.2);
  color: #fca5a5;
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: border-radius(large);
  cursor: pointer;
  font-size: font-size(sm);
  transition: all transition(normal);

  &:hover {
    background: rgba(220, 38, 38, 0.3);
    transform: translateY(-1px);
  }
}

@include tablet {
  .app-header {
    flex-direction: column;
    gap: spacing(md);

    h1 {
      font-size: font-size(xxl);
    }
  }

  .header-controls {
    order: 2;
  }

  .main-content {
    padding: spacing(lg) spacing(md);
  }
}
</style>
