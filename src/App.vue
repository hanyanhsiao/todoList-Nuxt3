<template>
  <div id="app">
    <header class="app-header">
      <h1>待辦事項管理</h1>
      <button @click="toggleCategoryManager" class="settings-btn">
        {{ showCategoryManager ? '隱藏' : '管理' }}分類
      </button>
    </header>

    <main class="main-content">
      <div class="container">
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
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTodos } from '@/composables/useTodos';
import TodoInput from '@/components/TodoInput.vue';
import TodoFilter from '@/components/TodoFilter.vue';
import TodoList from '@/components/TodoList.vue';
import CategoryManager from '@/components/CategoryManager.vue';
import type { Category } from '@/types';

const {
  state,
  searchQuery,
  filteredTodos,
  todoStats,
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
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  min-height: 100vh;
  background: linear-gradient(135deg, #62d2fbff 0%, #1964cc 100%);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
}

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

.settings-btn {
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

.settings-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.main-content {
  padding: 40px 24px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    gap: 12px;
  }

  .app-header h1 {
    font-size: 24px;
  }

  .main-content {
    padding: 24px 16px;
  }
}
</style>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
}

* {
  box-sizing: border-box;
}
</style>
