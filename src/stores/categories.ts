import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Category } from '@/types'
import CategoryService from '@/services/category.service'

export const useCategoryStore = defineStore('categories', () => {
  const categories = ref<Category[]>([])
  const loading = ref(false)

  async function fetchCategories() {
    loading.value = true
    try {
      categories.value = await CategoryService.getAll()
    } catch (err) {
      console.error('Erreur lors du chargement des catégories', err)
    } finally {
      loading.value = false
    }
  }

  function getCategoryName(categoryId: number): string {
    const category = categories.value.find(c => c.id === categoryId)
    return category?.name || 'Inconnu'
  }

  return {
    categories,
    loading,
    fetchCategories,
    getCategoryName
  }
})