export interface TodoItem {
  id: string
  title: string
  description?: string
  completed: boolean
  category: string
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  color: string
}

export type FilterType = 'all' | 'completed' | 'pending'

export interface TodoState {
  todos: TodoItem[]
  categories: Category[]
  filter: FilterType
  selectedCategory: string
}