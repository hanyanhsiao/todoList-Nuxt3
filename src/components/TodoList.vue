<template>
  <div class="todo-list-container card">
    <div v-if="todos.length === 0" class="empty-state">
      <h3>沒有待辦事項</h3>
      <p>開始新增你的第一個待辦事項吧！</p>
    </div>

    <div v-else class="todo-list">
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        :categories="categories"
        @update="(updates: Partial<TodoItemType>) => $emit('updateTodo', todo.id, updates)"
        @delete="$emit('deleteTodo', todo.id)"
        @toggle="$emit('toggleTodo', todo.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import TodoItem from './TodoItem.vue';
import type { TodoItem as TodoItemType, Category } from '@/types';

interface Props {
  todos: TodoItemType[];
  categories: Category[];
}

interface Emits {
  (e: 'updateTodo', id: string, updates: Partial<TodoItemType>): void;
  (e: 'deleteTodo', id: string): void;
  (e: 'toggleTodo', id: string): void;
}

defineProps<Props>();
defineEmits<Emits>();
</script>

<style scoped>
.todo-list-container {
  overflow: hidden;
  padding: 0;
}

.empty-state {
  padding: 60px 24px;
  text-align: center;
  color: #6b7280;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #374151;
}

.empty-state p {
  margin: 0;
  font-size: 16px;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
}

.todo-list > :first-child {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.todo-list > :last-child {
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}
</style>
