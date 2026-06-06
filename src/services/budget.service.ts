import api from './api'
import type { Budget, BudgetDTO, BudgetStatus, BudgetAlert } from '@/types'

class BudgetService {
  async getAll(): Promise<Budget[]> {
    const response = await api.get<Budget[]>('/budgets')
    return response.data
  }

  async getById(id: number): Promise<Budget> {
    const response = await api.get<Budget>(`/budgets/${id}`)
    return response.data
  }

  async getByMonth(month: number, year: number): Promise<Budget[]> {
    const response = await api.get<Budget[]>('/budgets/by-month', {
      params: { month, year }
    })
    return response.data
  }

  async create(budget: BudgetDTO): Promise<Budget> {
    const response = await api.post<Budget>('/budgets', budget)
    return response.data
  }

  async update(id: number, budget: BudgetDTO): Promise<Budget> {
    const response = await api.put<Budget>(`/budgets/${id}`, budget)
    return response.data
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/budgets/${id}`)
  }

  async getStatus(budgetId: number): Promise<BudgetStatus> {
    const response = await api.get<BudgetStatus>(`/budgets/${budgetId}/status`)
    return response.data
  }

  async getAllStatus(month: number, year: number): Promise<BudgetStatus[]> {
    const response = await api.get<BudgetStatus[]>('/budgets/status', {
      params: { month, year }
    })
    return response.data
  }

  async getAlerts(month: number, year: number): Promise<BudgetAlert[]> {
    const response = await api.get<BudgetAlert[]>('/budgets/alerts', {
      params: { month, year }
    })
    return response.data
  }
}

export default new BudgetService()