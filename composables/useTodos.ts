import { reactive, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import type { TodoItem, Category, FilterType, TodoState } from '~/types';

export function useTodos() {
  const api = useApi();

  const state = reactive<TodoState>({
    todos: [],
    categories: [],
    filter: 'all',
    selectedCategory: 'all',
  });

  const searchQuery = ref('');
  const loading = ref(false);
  const error = ref<string | null>(null);

  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  // 載入所有資料
  const loadData = async () => {
    loading.value = true;
    error.value = null;
    try {
      const [todosData, categoriesData] = await Promise.all([
        api.getTodos(),
        api.getCategories(),
      ]);
      state.todos = todosData;
      state.categories = categoriesData;
    } catch (err) {
      error.value = '載入資料失敗';
      console.error('載入資料錯誤:', err);
    } finally {
      loading.value = false;
    }
  };

  const addTodo = async (
    todoData: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    loading.value = true;
    try {
      const newTodo: Omit<TodoItem, 'id'> = {
        ...todoData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const createdTodo = await api.createTodo(newTodo);
      state.todos.unshift(createdTodo);
    } catch (err) {
      error.value = '新增待辦事項失敗';
      console.error('新增待辦事項錯誤:', err);
    } finally {
      loading.value = false;
    }
  };

  const updateTodo = async (id: string, updates: Partial<TodoItem>) => {
    loading.value = true;
    try {
      const updatedTodo = await api.updateTodo(id, {
        ...updates,
        updatedAt: new Date(),
      });
      const todoIndex = state.todos.findIndex((todo) => todo.id === id);
      if (todoIndex !== -1) {
        state.todos[todoIndex] = updatedTodo;
      }
    } catch (err) {
      error.value = '更新待辦事項失敗';
      console.error('更新待辦事項錯誤:', err);
    } finally {
      loading.value = false;
    }
  };

  const deleteTodo = async (id: string) => {
    loading.value = true;
    try {
      await api.deleteTodo(id);
      const todoIndex = state.todos.findIndex((todo) => todo.id === id);
      if (todoIndex !== -1) {
        state.todos.splice(todoIndex, 1);
      }
    } catch (err) {
      error.value = '刪除待辦事項失敗';
      console.error('刪除待辦事項錯誤:', err);
    } finally {
      loading.value = false;
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = state.todos.find((todo) => todo.id === id);
    if (!todo) return;

    await updateTodo(id, {
      completed: !todo.completed,
    });
  };

  const addCategory = async (categoryData: Omit<Category, 'id'>) => {
    loading.value = true;
    try {
      const newCategory = await api.createCategory({
        ...categoryData,
      });
      state.categories.push(newCategory);
    } catch (err) {
      error.value = '新增分類失敗';
      console.error('新增分類錯誤:', err);
    } finally {
      loading.value = false;
    }
  };

  const deleteCategory = async (id: string) => {
    loading.value = true;
    try {
      await api.deleteCategory(id);
      const categoryIndex = state.categories.findIndex((cat) => cat.id === id);
      if (categoryIndex !== -1) {
        state.categories.splice(categoryIndex, 1);
      }

      // 更新相關待辦事項的分類
      const affectedTodos = state.todos.filter((todo) => todo.category === id);
      for (const todo of affectedTodos) {
        await updateTodo(todo.id, { category: 'personal' });
      }
    } catch (err) {
      error.value = '刪除分類失敗';
      console.error('刪除分類錯誤:', err);
    } finally {
      loading.value = false;
    }
  };

  const setFilter = (filter: FilterType) => {
    state.filter = filter;
  };

  const setSelectedCategory = (categoryId: string) => {
    state.selectedCategory = categoryId;
  };

  const filteredTodos = computed(() => {
    return state.todos.filter((todo) => {
      if (state.filter === 'completed' && !todo.completed) return false;
      if (state.filter === 'pending' && todo.completed) return false;

      if (
        state.selectedCategory !== 'all' &&
        todo.category !== state.selectedCategory
      )
        return false;

      if (
        searchQuery.value &&
        !todo.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
        return false;

      return true;
    });
  });

  const todoStats = computed(() => ({
    total: state.todos.length,
    completed: state.todos.filter((todo) => todo.completed).length,
    pending: state.todos.filter((todo) => !todo.completed).length,
  }));

  return {
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
  };
}
