<template>
  <div class="todo-list-container card">
    <div v-if="todos.length === 0" class="empty-state">
      <h3>{{ t('noTodos') }}</h3>
      <p>{{ t('startAddingTodos') }}</p>
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
import { useI18n } from 'vue-i18n';
import TodoItem from './TodoItem.vue';
import type { TodoItem as TodoItemType, Category } from '~/types';

const { t } = useI18n();

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

<style scoped lang="scss">
@import '~/assets/styles/variables';
@import '~/assets/styles/mixins';

.todo-list-container {
  overflow: hidden;
  padding: 0;
}

.empty-state {
  padding: 60px spacing(lg);
  text-align: center;
  color: color(gray-500);

  h3 {
    margin: 0 0 spacing(sm) 0;
    font-size: font-size(xl);
    font-weight: font-weight(semibold);
    color: color(gray-700);
  }

  p {
    margin: 0;
    font-size: font-size(base);
  }
}

.empty-icon {
  font-size: 48px;
  margin-bottom: spacing(md);
}

.todo-list {
  @include flex-column;
  gap: spacing(lg);
  padding: spacing(lg);

  > :first-child {
    border-top-left-radius: border-radius(xlarge);
    border-top-right-radius: border-radius(xlarge);
  }

  > :last-child {
    border-bottom-left-radius: border-radius(xlarge);
    border-bottom-right-radius: border-radius(xlarge);
  }
}
</style>
