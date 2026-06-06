import api from './api'
import type { Revenue, RevenueDTO } from '@/types'

class RevenueService {
  async getAll(): Promise<Revenue[]> {
    const response = await api.get<Revenue[]>('/revenues')
    return response.data
  }

  async getById(id: number): Promise<Revenue> {
    const response = await api.get<Revenue>(`/revenues/${id}`)
    return response.data
  }

  async create(revenue: RevenueDTO): Promise<Revenue> {
    const response = await api.post<Revenue>('/revenues', revenue)
    return response.data
  }

  async update(id: number, revenue: RevenueDTO): Promise<Revenue> {
    const response = await api.put<Revenue>(`/revenues/${id}`, revenue)
    return response.data
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/revenues/${id}`)
  }

  async search(keyword: string): Promise<Revenue[]> {
    const response = await api.get<Revenue[]>('/revenues/search', {
      params: { keyword }
    })
    return response.data
  }
}

export default new RevenueService()