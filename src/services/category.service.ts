import api from './api'
import type { Category } from '@/types'

class CategoryService {
  async getAll(): Promise<Category[]> {
    const response = await api.get<Category[]>('/categories')
    return response.data
  }
}

export default new CategoryService()