import { reactive, ref, computed } from 'vue';
import type { TodoItem, Category, FilterType, TodoState } from '@/types';

const STORAGE_KEY = 'vue3-todo-app';

export function useTodos() {
  const state = reactive<TodoState>({
    todos: [],
    categories: [
      { id: 'work', name: '工作', color: '#3b82f6' },
      { id: 'personal', name: '個人', color: '#10b981' },
      { id: 'study', name: '學習', color: '#f59e0b' },
    ],
    filter: 'all',
    selectedCategory: 'all',
  });

  const searchQuery = ref('');

  const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const saveToLocalStorage = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        todos: state.todos,
        categories: state.categories,
      })
    );
  };

  const loadFromLocalStorage = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        state.todos =
          parsed.todos?.map((todo: any) => ({
            ...todo,
            createdAt: new Date(todo.createdAt),
            updatedAt: new Date(todo.updatedAt),
          })) || [];
        state.categories = parsed.categories || state.categories;
      } catch (error) {
        console.error('Failed to load data from localStorage:', error);
      }
    }
  };

  const addTodo = (
    todoData: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    const newTodo: TodoItem = {
      id: generateId(),
      ...todoData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    state.todos.unshift(newTodo);
    saveToLocalStorage();
  };

  const updateTodo = (id: string, updates: Partial<TodoItem>) => {
    const todoIndex = state.todos.findIndex((todo) => todo.id === id);
    if (todoIndex !== -1) {
      state.todos[todoIndex] = {
        ...state.todos[todoIndex],
        ...updates,
        updatedAt: new Date(),
      };
      saveToLocalStorage();
    }
  };

  const deleteTodo = (id: string) => {
    const todoIndex = state.todos.findIndex((todo) => todo.id === id);
    if (todoIndex !== -1) {
      state.todos.splice(todoIndex, 1);
      saveToLocalStorage();
    }
  };

  const toggleTodo = (id: string) => {
    updateTodo(id, {
      completed: !state.todos.find((todo) => todo.id === id)?.completed,
    });
  };

  const addCategory = (categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      id: generateId(),
      ...categoryData,
    };
    state.categories.push(newCategory);
    saveToLocalStorage();
  };

  const deleteCategory = (id: string) => {
    const categoryIndex = state.categories.findIndex((cat) => cat.id === id);
    if (categoryIndex !== -1) {
      state.categories.splice(categoryIndex, 1);
      state.todos.forEach((todo) => {
        if (todo.category === id) {
          updateTodo(todo.id, { category: 'personal' });
        }
      });
      saveToLocalStorage();
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

  loadFromLocalStorage();

  return {
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
  };
}
