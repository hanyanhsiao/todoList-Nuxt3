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
    <div class="content">
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
import { useI18n } from 'vue-i18n';
import type { TodoItem, Category } from '~/types';

const { t } = useI18n();

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
  return category?.name ? t(category.id) : t('uncategorized');
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

<style scoped lang="scss">
@import '~/assets/styles/variables';
@import '~/assets/styles/mixins';

.todo-item {
  @include flex-start;
  gap: spacing(md);
  padding: spacing(md);
  background: color(white);
  border: 1px solid color(gray-200);
  border-radius: border-radius(large);
  transition: all transition(normal);

  &:hover {
    border-color: color(gray-300);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  &.completed {
    opacity: 0.7;

    .title {
      text-decoration: line-through;
      color: color(gray-400);
    }
  }
}

.checkbox {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border: 2px solid color(gray-300);
  border-radius: border-radius(small);
  background: color(white);
  cursor: pointer;
  @include flex-center;
  transition: all transition(normal);
  padding: 0;

  &:hover {
    border-color: color(primary);
  }

  &.checked {
    background: color(primary);
    border-color: color(primary);
  }
}

.check-icon {
  width: 12px;
  height: 12px;
  fill: color(white);
}

.content {
  flex: 1;
  cursor: pointer;
}

.title {
  font-weight: font-weight(medium);
  color: color(gray-700);
  margin-bottom: spacing(xs);
  line-height: 1.4;
}

.description {
  font-size: font-size(sm);
  color: color(gray-500);
  margin-bottom: spacing(sm);
  line-height: 1.4;
}

.meta {
  @include flex-start;
  gap: spacing(md);
  font-size: font-size(xs);
}

.category {
  padding: 2px spacing(sm);
  border-radius: 12px;
  color: color(white);
  font-weight: font-weight(medium);
}

.date {
  color: color(gray-400);
}

.edit-form {
  flex: 1;
  @include flex-column;
  gap: spacing(sm);
}

.edit-input {
  padding: spacing(sm) spacing(md);
  border: 2px solid color(primary);
  border-radius: border-radius(small);
  font-size: font-size(sm);
  font-weight: font-weight(medium);
}

.edit-description {
  padding: spacing(sm) spacing(md);
  border: 2px solid color(gray-200);
  border-radius: border-radius(small);
  font-size: font-size(sm);
  font-family: inherit;
  resize: vertical;
}

.edit-category {
  padding: spacing(sm) spacing(md);
  border: 2px solid color(gray-200);
  border-radius: border-radius(small);
  font-size: font-size(sm);
  background: color(white);
}

.actions {
  flex-shrink: 0;
  @include flex-start;
  gap: spacing(xs);
}

.delete-btn {
  @include action-button;
}
</style>
