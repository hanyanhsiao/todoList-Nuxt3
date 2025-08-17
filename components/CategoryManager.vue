<template>
  <div class="category-manager card">
    <h3 class="card-title">{{ $t('categoryManager') }}</h3>

    <!-- 新增分類表單 -->
    <form @submit.prevent="handleAddCategory" class="add-category-form">
      <div class="form-row">
        <input
          v-model="newCategoryName"
          type="text"
          :placeholder="$t('categoryName')"
          class="form-input category-input"
          required
        />
        <input
          v-model="newCategoryColor"
          type="color"
          class="color-picker"
          :title="$t('categoryColor')"
        />
        <button
          type="submit"
          class="btn btn-primary add-btn"
          :disabled="!newCategoryName.trim()"
        >
          {{ $t('addCategory') }}
        </button>
      </div>
    </form>

    <!-- 分類列表 -->
    <div class="category-list">
      <div
        v-for="category in editableCategories"
        :key="category.id"
        class="category-item"
      >
        <div class="category-info">
          <div
            class="category-color"
            :style="{ backgroundColor: category.color }"
          ></div>
          <span class="category-name"
            >{{ getCategoryDisplayName(category) }}aaa</span
          >
        </div>

        <div class="category-actions">
          <button
            @click="startEditCategory(category)"
            class="action-btn edit-btn"
            :title="$t('edit')"
          >
            <svg viewBox="0 0 24 24">
              <path
                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
              />
            </svg>
          </button>

          <button
            @click="$emit('deleteCategory', category.id)"
            class="action-btn delete-btn"
            :title="$t('delete')"
            :disabled="!canDeleteCategory(category.id)"
          >
            <svg viewBox="0 0 24 24">
              <path
                d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <!-- 需求沒寫到要編輯先註解 -->
    <!-- <div v-if="editingCategory" class="modal-overlay" @click="cancelEdit">
      <div class="modal-content" @click.stop>
        <h4>編輯分類</h4>
        <form @submit.prevent="saveEditCategory" class="edit-form">
          <div class="form-group">
            <label class="form-label">名稱:</label>
            <input
              v-model="editCategoryName"
              type="text"
              class="form-input"
              required
            />
          </div>
          <div class="form-group">
            <label class="form-label">顏色:</label>
            <input
              v-model="editCategoryColor"
              type="color"
              class="form-color-picker"
            />
          </div>
          <div class="form-actions">
            <button
              type="button"
              @click="cancelEdit"
              class="btn btn-secondary cancel-btn"
            >
              取消
            </button>
            <button type="submit" class="btn btn-primary save-btn">儲存</button>
          </div>
        </form>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Category } from '~/types';

import { useI18n } from 'vue-i18n';

const { t } = useI18n();

interface Props {
  categories: Category[];
  todosCount: Record<string, number>;
}

interface Emits {
  (e: 'addCategory', category: Omit<Category, 'id'>): void;
  (e: 'updateCategory', id: string, updates: Partial<Category>): void;
  (e: 'deleteCategory', id: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const newCategoryName = ref('');
const newCategoryColor = ref('#3b82f6');

const editingCategory = ref<Category | null>(null);
const editCategoryName = ref('');
const editCategoryColor = ref('');

const predefinedCategories = ['work', 'personal', 'study'];

const getCategoryDisplayName = (category: Category) => {
  if (predefinedCategories.includes(category.id)) {
    return t(category.id);
  }
  return category.name;
};

const editableCategories = computed(() => {
  return props.categories.filter(
    (cat) => !predefinedCategories.includes(cat.id)
  );
});

const canDeleteCategory = (categoryId: string) => {
  return (
    !predefinedCategories.includes(categoryId) &&
    (props.todosCount[categoryId] || 0) === 0
  );
};

const handleAddCategory = () => {
  if (!newCategoryName.value.trim()) return;

  emit('addCategory', {
    name: newCategoryName.value.trim(),
    color: newCategoryColor.value,
  });

  newCategoryName.value = '';
  newCategoryColor.value = '#3b82f6';
};

const startEditCategory = (category: Category) => {
  editingCategory.value = category;
  editCategoryName.value = category.name;
  editCategoryColor.value = category.color;
};

const saveEditCategory = () => {
  if (!editingCategory.value || !editCategoryName.value.trim()) return;

  emit('updateCategory', editingCategory.value.id, {
    name: editCategoryName.value.trim(),
    color: editCategoryColor.value,
  });

  cancelEdit();
};

const cancelEdit = () => {
  editingCategory.value = null;
  editCategoryName.value = '';
  editCategoryColor.value = '';
};
</script>

<style scoped lang="scss">
@import '~/assets/styles/variables';
@import '~/assets/styles/mixins';

.add-category-form {
  margin-bottom: spacing(lg);
}

.form-row {
  @include flex-start;
  gap: spacing(md);
}

.category-input {
  flex: 1;
  font-size: font-size(base);
}

.color-picker {
  width: 40px;
  height: 36px;
  border: 2px solid color(gray-200);
  border-radius: border-radius(medium);
  cursor: pointer;
}

.add-btn {
  padding: spacing(sm) spacing(md);
  font-size: font-size(sm);
}

.category-list {
  @include flex-column;
  gap: spacing(sm);
}

.category-item {
  @include flex-between;
  padding: spacing(md);
  border: 1px solid color(gray-200);
  border-radius: border-radius(medium);
  transition: border-color transition(normal);

  &:hover {
    border-color: color(gray-300);
  }
}

.category-info {
  @include flex-start;
  gap: spacing(md);
}

.category-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.category-name {
  font-weight: font-weight(medium);
  color: color(gray-700);
}

.category-actions {
  @include flex-start;
  gap: spacing(xs);
}

.action-btn {
  @include action-button(28px);

  svg {
    width: 14px;
    height: 14px;
  }
}

.edit-btn {
  @include button-variant(color(gray-100), color(gray-500), color(gray-200));

  &:hover {
    color: color(gray-700);
  }
}

.delete-btn {
  @include button-variant(
    color(danger-bg),
    color(danger),
    color(danger-bg-hover)
  );

  &:hover:not(:disabled) {
    color: color(danger-hover);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  @include flex-center;
  z-index: 1000;
}

.modal-content {
  background: color(white);
  border-radius: border-radius(xlarge);
  padding: spacing(lg);
  width: 90%;
  max-width: 400px;
  box-shadow: shadow(heavy);

  h4 {
    margin: 0 0 spacing(lg) 0;
    color: color(gray-700);
    font-size: font-size(lg);
    font-weight: font-weight(semibold);
  }
}

.edit-form {
  @include flex-column;
  gap: spacing(md);
}

.form-group {
  @include flex-column;
  gap: spacing(sm);

  label {
    font-weight: font-weight(medium);
    color: color(gray-700);
    font-size: font-size(sm);
  }
}

.form-input {
  padding: spacing(sm) spacing(md);
  border: 2px solid color(gray-200);
  border-radius: border-radius(medium);
  font-size: font-size(sm);

  &:focus {
    outline: none;
    border-color: color(primary);
  }
}

.form-color-picker {
  width: 60px;
  height: 36px;
  border: 2px solid color(gray-200);
  border-radius: border-radius(medium);
  cursor: pointer;
}

.form-actions {
  @include flex-start;
  gap: spacing(md);
  justify-content: flex-end;
}

.cancel-btn {
  @include button-base;
  @include button-variant(color(gray-100), color(gray-500), color(gray-200));

  &:hover {
    color: color(gray-700);
  }
}

.save-btn {
  @include button-base;
  @include button-variant(color(primary), color(white), color(primary-hover));
}
</style>
