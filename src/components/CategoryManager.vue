<template>
  <div class="category-manager card">
    <h3 class="card-title">分類管理</h3>

    <!-- 新增分類表單 -->
    <form @submit.prevent="handleAddCategory" class="add-category-form">
      <div class="form-row">
        <input
          v-model="newCategoryName"
          type="text"
          placeholder="分類名稱"
          class="form-input category-input"
          required
        />
        <input
          v-model="newCategoryColor"
          type="color"
          class="color-picker"
          title="選擇顏色"
        />
        <button
          type="submit"
          class="btn btn-primary add-btn"
          :disabled="!newCategoryName.trim()"
        >
          新增
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
          <span class="category-name">{{ category.name }}</span>
        </div>

        <div class="category-actions">
          <button
            @click="startEditCategory(category)"
            class="action-btn edit-btn"
            title="編輯"
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
            title="刪除"
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

    <!-- 編輯分類模態框 -->
    <div v-if="editingCategory" class="modal-overlay" @click="cancelEdit">
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
            <button type="button" @click="cancelEdit" class="btn btn-secondary cancel-btn">
              取消
            </button>
            <button type="submit" class="btn btn-primary save-btn">儲存</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Category } from '@/types';

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

<style scoped>
/* 使用共用 CSS */

.add-category-form {
  margin-bottom: 20px;
}

.form-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.category-input {
  flex: 1;
  font-size: 16px;
}

.color-picker {
  width: 40px;
  height: 36px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
}

.add-btn {
  padding: 8px 16px;
  font-size: 14px;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  transition: border-color 0.2s;
}

.category-item:hover {
  border-color: #d1d5db;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.category-name {
  font-weight: 500;
  color: #374151;
}

.category-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.action-btn svg {
  width: 14px;
  height: 14px;
}

.edit-btn {
  background: #f3f4f6;
  color: #6b7280;
}

.edit-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.delete-btn {
  background: #fef2f2;
  color: #dc2626;
}

.delete-btn:hover:not(:disabled) {
  background: #fee2e2;
  color: #b91c1c;
}

.delete-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-content h4 {
  margin: 0 0 20px 0;
  color: #374151;
  font-size: 18px;
  font-weight: 600;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.form-input {
  padding: 8px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
}

.form-color-picker {
  width: 60px;
  height: 36px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.cancel-btn {
  padding: 8px 16px;
  background: #f3f4f6;
  color: #6b7280;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-btn:hover {
  background: #e5e7eb;
}

.save-btn {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.save-btn:hover {
  background: #2563eb;
}
</style>
