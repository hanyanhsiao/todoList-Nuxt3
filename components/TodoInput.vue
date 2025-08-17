<template>
  <div class="todo-input-container card">
    <h3 class="card-title">{{ t('addTodo') }}</h3>
    <form @submit.prevent="handleSubmit" class="todo-form">
      <div>
        <label for="todo-title" class="form-label">{{ t('todoTitle') }}:</label>
        <div class="input-group">
          <input
            v-model="title"
            type="text"
            :placeholder="t('addTodoPlaceholder')"
            class="form-input"
            required
          />
          <select v-model="selectedCategory" class="category-select">
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ getCategoryDisplayName(category) }}
            </option>
          </select>
        </div>
      </div>
      <div>
        <label for="todo-description" class="form-label"
          >{{ t('todoDescription') }}:</label
        >
        <div class="input-group">
          <textarea
            id="todo-description"
            v-model="description"
            :placeholder="t('descriptionPlaceholder')"
            class="form-input description-input"
            rows="5"
          ></textarea>
        </div>
      </div>

      <button
        type="submit"
        class="btn btn-primary add-button"
        :disabled="!title.trim()"
      >
        {{ t('addCategory') }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Category, TodoItem } from '~/types';

const { t } = useI18n();

interface Props {
  categories: Category[];
}

interface Emits {
  (e: 'addTodo', todo: Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'>): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();

const title = ref('');
const description = ref('');
const selectedCategory = ref('personal');

const predefinedCategoryKeys = ['work', 'personal', 'study'];

const getCategoryDisplayName = (category: Category) => {
  if (predefinedCategoryKeys.includes(category.id)) {
    return t(category.id);
  }
  return category.name;
};

const handleSubmit = () => {
  if (!title.value.trim()) return;

  emit('addTodo', {
    title: title.value.trim(),
    description: description.value.trim() || undefined,
    completed: false,
    category: selectedCategory.value,
  });

  title.value = '';
  description.value = '';
  selectedCategory.value = 'personal';
};
</script>

<style scoped lang="scss">
@import '~/assets/styles/variables';
@import '~/assets/styles/mixins';

.todo-form {
  @include flex-column;
  gap: spacing(md);
}

.input-group {
  @include flex-start;
  gap: spacing(md);
}

.form-input {
  flex: 1;
}

.category-select {
  @include form-input-base;
  max-width: 120px;
  background: color(white);
}

.description-input {
  font-family: inherit;
  resize: none;
}

.add-button {
  align-self: flex-start;
  padding: spacing(md) spacing(lg);
  font-size: font-size(base);
}
</style>
