<template>
  <div class="todo-item" :class="{ completed: todo.completed }">
    <!-- 完成狀態勾選框 -->
    <button
      @click="$emit('toggle')"
      class="checkbox"
      :class="{ checked: todo.completed }"
    >
      <svg v-if="todo.completed" viewBox="0 0 24 24" class="check-icon">
        <path
          d="M9 16.17L5.53 12.7a.996.996 0 10-1.41 1.41L9 19l11-11a.996.996 0 10-1.41-1.41L9 16.17z"
        />
      </svg>
    </button>

    <!-- 內容區域 -->
    <div class="content" v-if="!isEditing">
      <div class="title">{{ todo.title }}</div>
      <div v-if="todo.description" class="description">
        {{ todo.description }}
      </div>
      <div class="meta">
        <span class="category" :style="{ backgroundColor: categoryColor }">
          {{ categoryName }}
        </span>
        <span class="date">{{ formatDate(todo.createdAt) }}</span>
      </div>
    </div>

    <!-- 編輯模式 -->
    <div v-else class="edit-form">
      <input
        ref="editInput"
        v-model="editTitle"
        @keyup.enter="saveEdit"
        @keyup.escape="cancelEdit"
        @blur="saveEdit"
        class="edit-input"
      />
      <textarea
        v-model="editDescription"
        @keyup.escape="cancelEdit"
        placeholder="描述"
        class="edit-description"
        rows="2"
      ></textarea>
      <select v-model="editCategory" class="edit-category">
        <option
          v-for="category in categories"
          :key="category.id"
          :value="category.id"
        >
          {{ category.name }}
        </option>
      </select>
    </div>

    <div class="actions">
      <!-- 需求沒寫到要編輯先註解 -->
      <!-- <button
        v-if="!isEditing"
        @click="startEdit"
        class="action-btn edit-btn"
        title="編輯"
      >
        <svg viewBox="0 0 24 24">
          <path
            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
          />
        </svg>
      </button> -->

      <button
        @click="$emit('delete')"
        class="action-btn btn-danger delete-btn"
        title="刪除"
      >
        <svg viewBox="0 0 24 24">
          <path
            d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TodoItem, Category } from '@/types';

interface Props {
  todo: TodoItem;
  categories: Category[];
}

interface Emits {
  (e: 'update', updates: Partial<TodoItem>): void;
  (e: 'delete'): void;
  (e: 'toggle'): void;
}

const props = defineProps<Props>();
defineEmits<Emits>();

const categoryName = computed(() => {
  const category = props.categories.find(
    (cat) => cat.id === props.todo.category
  );
  return category?.name || '未分類';
});

const categoryColor = computed(() => {
  const category = props.categories.find(
    (cat) => cat.id === props.todo.category
  );
  return category?.color || '#6b7280';
});

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('zh-TW', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// 需求沒寫到要編輯先註解
// const isEditing = ref(false);
// const editTitle = ref('');
// const editDescription = ref('');
// const editCategory = ref('');
// const editInput = ref<HTMLInputElement>();

// const startEdit = () => {
//   if (props.todo.completed) return;

//   isEditing.value = true;
//   editTitle.value = props.todo.title;
//   editDescription.value = props.todo.description || '';
//   editCategory.value = props.todo.category;

//   nextTick(() => {
//     editInput.value?.focus();
//     editInput.value?.select();
//   });
// };

// const saveEdit = () => {
//   if (!editTitle.value.trim()) {
//     cancelEdit();
//     return;
//   }

//   emit('update', {
//     title: editTitle.value.trim(),
//     description: editDescription.value.trim() || undefined,
//     category: editCategory.value,
//   });

//   isEditing.value = false;
// };

// const cancelEdit = () => {
//   isEditing.value = false;
//   editTitle.value = '';
//   editDescription.value = '';
//   editCategory.value = '';
// };
</script>

<style scoped>
.todo-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s;
}

.todo-item:hover {
  border-color: #d1d5db;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.todo-item.completed {
  opacity: 0.7;
}

.checkbox {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border: 2px solid #d1d5db;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  padding: 0px;
}

.checkbox:hover {
  border-color: #3b82f6;
}

.checkbox.checked {
  background: #3b82f6;
  border-color: #3b82f6;
}

.check-icon {
  width: 12px;
  height: 12px;
  fill: white;
}

.content {
  flex: 1;
  cursor: pointer;
}

.title {
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
  line-height: 1.4;
}

.completed .title {
  text-decoration: line-through;
  color: #9ca3af;
}

.description {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
  line-height: 1.4;
}

.meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
}

.category {
  padding: 2px 8px;
  border-radius: 12px;
  color: white;
  font-weight: 500;
}

.date {
  color: #9ca3af;
}

.edit-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.edit-input {
  padding: 8px 12px;
  border: 2px solid #3b82f6;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
}

.edit-description {
  padding: 8px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
}

.edit-category {
  padding: 8px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 4px;
  font-size: 14px;
  background: white;
}

.actions {
  flex-shrink: 0;
  display: flex;
  gap: 4px;
}

/* 使用共用的 action-btn 和 btn-danger 樣式 */

.delete-btn {
  width: 32px;
  height: 32px;
}
</style>
