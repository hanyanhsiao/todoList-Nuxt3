import type { TodoItem, Category } from '~/types';

export const useApi = () => {
  const baseURL = 'http://localhost:3002';

  // Todo CRUD 操作
  const getTodos = async (): Promise<TodoItem[]> => {
    try {
      const data = await $fetch<TodoItem[]>(`${baseURL}/todos`);
      return data.map((todo) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        updatedAt: new Date(todo.updatedAt),
      }));
    } catch (error) {
      console.error('獲取待辦事項失敗:', error);
      throw error;
    }
  };

  const createTodo = async (todo: Omit<TodoItem, 'id'>): Promise<TodoItem> => {
    try {
      const data = await $fetch<TodoItem>(`${baseURL}/todos`, {
        method: 'POST',
        body: {
          ...todo,
          createdAt: todo.createdAt.toISOString(),
          updatedAt: todo.updatedAt.toISOString(),
        },
      });
      return {
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      };
    } catch (error) {
      console.error('創建待辦事項失敗:', error);
      throw error;
    }
  };

  const updateTodo = async (
    id: string,
    todo: Partial<TodoItem>
  ): Promise<TodoItem> => {
    try {
      const updateData = { ...todo };
      if (updateData.createdAt) {
        updateData.createdAt = updateData.createdAt.toISOString() as any;
      }
      if (updateData.updatedAt) {
        updateData.updatedAt = updateData.updatedAt.toISOString() as any;
      }

      const data = await $fetch<TodoItem>(`${baseURL}/todos/${id}`, {
        method: 'PATCH',
        body: updateData,
      });
      return {
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt),
      };
    } catch (error) {
      console.error('更新待辦事項失敗:', error);
      throw error;
    }
  };

  const deleteTodo = async (id: string): Promise<void> => {
    try {
      await $fetch(`${baseURL}/todos/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('刪除待辦事項失敗:', error);
      throw error;
    }
  };

  // Category CRUD 操作
  const getCategories = async (): Promise<Category[]> => {
    try {
      const data = await $fetch<Category[]>(`${baseURL}/categories`);
      return data;
    } catch (error) {
      console.error('獲取分類失敗:', error);
      throw error;
    }
  };

  const createCategory = async (
    category: Omit<Category, 'id'>
  ): Promise<Category> => {
    try {
      const data = await $fetch<Category>(`${baseURL}/categories`, {
        method: 'POST',
        body: category,
      });
      return data;
    } catch (error) {
      console.error('創建分類失敗:', error);
      throw error;
    }
  };

  const updateCategory = async (
    id: string,
    category: Partial<Category>
  ): Promise<Category> => {
    try {
      const data = await $fetch<Category>(`${baseURL}/categories/${id}`, {
        method: 'PATCH',
        body: category,
      });
      return data;
    } catch (error) {
      console.error('更新分類失敗:', error);
      throw error;
    }
  };

  const deleteCategory = async (id: string): Promise<void> => {
    try {
      await $fetch(`${baseURL}/categories/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('刪除分類失敗:', error);
      throw error;
    }
  };

  return {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
