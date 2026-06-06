import api from './api'
import type { Expense, ExpenseDTO } from '@/types'

class ExpenseService {
  async getAll(): Promise<Expense[]> {
    const response = await api.get<Expense[]>('/expenses')
    return response.data
  }

  async getById(id: number): Promise<Expense> {
    const response = await api.get<Expense>(`/expenses/${id}`)
    return response.data
  }

  async create(expense: ExpenseDTO): Promise<Expense> {
    const response = await api.post<Expense>('/expenses', expense)
    return response.data
  }

  async update(id: number, expense: ExpenseDTO): Promise<Expense> {
    const response = await api.put<Expense>(`/expenses/${id}`, expense)
    return response.data
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/expenses/${id}`)
  }

  async search(keyword: string): Promise<Expense[]> {
    const response = await api.get<Expense[]>('/expenses/search', {
      params: { keyword }
    })
    return response.data
  }
}

export default new ExpenseService()