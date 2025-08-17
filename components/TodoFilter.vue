<template>
  <div class="todo-filter-container card">
    <div class="filter-section">
      <h3 class="card-title">{{ t('filterTodos') }}</h3>

      <!-- 狀態篩選 -->
      <div class="filter-group">
        <label class="form-label">{{ t('filterTodos') }}:</label>
        <div class="filter-buttons">
          <button
            v-for="filter in filterOptions"
            :key="filter.value"
            :class="['filter-btn', { active: currentFilter === filter.value }]"
            @click="$emit('updateFilter', filter.value)"
          >
            {{ t(filter.label) }}
          </button>
        </div>
      </div>

      <!-- 分類篩選 -->
      <div class="filter-group">
        <label class="form-label">{{ t('category') }}:</label>
        <select
          :value="currentCategory"
          @change="
            $emit('updateCategory', ($event.target as HTMLSelectElement).value)
          "
          class="form-input category-filter"
        >
          <option value="all">{{ t('allCategories') }}</option>
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ t(category.id) }}
          </option>
        </select>
      </div>

      <!-- 搜尋 -->
      <div class="filter-group">
        <label class="form-label">{{ t('search') }}:</label>
        <input
          :value="searchQuery"
          @input="
            $emit('updateSearch', ($event.target as HTMLInputElement).value)
          "
          type="text"
          :placeholder="t('searchPlaceholder')"
          class="form-input search-input"
        />
      </div>
    </div>

    <!-- 統計資訊 -->
    <div class="stats-section">
      <div class="stat-item">
        <span class="stat-number">{{ stats.total }}</span>
        <span class="stat-label">{{ t('total') }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ stats.pending }}</span>
        <span class="stat-label">{{ t('pending') }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ stats.completed }}</span>
        <span class="stat-label">{{ t('completed') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import type { Category, FilterType } from '~/types';

const { t } = useI18n();

interface Props {
  categories: Category[];
  currentFilter: FilterType;
  currentCategory: string;
  searchQuery: string;
  stats: {
    total: number;
    completed: number;
    pending: number;
  };
}

interface Emits {
  (e: 'updateFilter', filter: FilterType): void;
  (e: 'updateCategory', categoryId: string): void;
  (e: 'updateSearch', query: string): void;
}

defineProps<Props>();
defineEmits<Emits>();

const filterOptions = [
  { value: 'all' as FilterType, label: 'all' },
  { value: 'pending' as FilterType, label: 'pending' },
  { value: 'completed' as FilterType, label: 'completed' },
];
</script>

<style scoped>
/* 使用共用 CSS */

.filter-group {
  margin-bottom: 16px;
}

.filter-buttons {
  display: flex;
  gap: 8px;
}

.category-filter {
  width: 100%;
  font-size: 14px;
  border-radius: 6px;
}

.search-input {
  width: 100%;
  font-size: 14px;
  border-radius: 6px;
}

.stats-section {
  display: flex;
  gap: 24px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #3b82f6;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>
