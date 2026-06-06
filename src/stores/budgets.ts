import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Budget, BudgetDTO, BudgetStatus, BudgetAlert } from '@/types'
import BudgetService from '@/services/budget.service'

export const useBudgetStore = defineStore('budgets', () => {
  const budgets = ref<Budget[]>([])
  const budgetStatuses = ref<BudgetStatus[]>([])
  const alerts = ref<BudgetAlert[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchBudgets(month?: number, year?: number) {
    loading.value = true
    error.value = null
    try {
      if (month && year) {
        budgets.value = await BudgetService.getByMonth(month, year)
      } else {
        budgets.value = await BudgetService.getAll()
      }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des budgets'
    } finally {
      loading.value = false
    }
  }

  async function fetchStatuses(month: number, year: number) {
    try {
      budgetStatuses.value = await BudgetService.getAllStatus(month, year)
    } catch (err: any) {
      console.error('Erreur chargement statuts:', err)
    }
  }

  async function fetchAlerts(month: number, year: number) {
    try {
      alerts.value = await BudgetService.getAlerts(month, year)
    } catch (err: any) {
      console.error('Erreur chargement alertes:', err)
    }
  }

  async function createBudget(data: BudgetDTO) {
    loading.value = true
    error.value = null
    try {
      const newBudget = await BudgetService.create(data)
      budgets.value.push(newBudget)
      return newBudget
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la création du budget'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateBudget(id: number, data: BudgetDTO) {
    loading.value = true
    error.value = null
    try {
      const updated = await BudgetService.update(id, data)
      const index = budgets.value.findIndex(b => b.id === id)
      if (index !== -1) {
        budgets.value[index] = updated
      }
      return updated
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la modification du budget'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteBudget(id: number) {
    loading.value = true
    error.value = null
    try {
      await BudgetService.delete(id)
      budgets.value = budgets.value.filter(b => b.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la suppression du budget'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    budgets,
    budgetStatuses,
    alerts,
    loading,
    error,
    fetchBudgets,
    fetchStatuses,
    fetchAlerts,
    createBudget,
    updateBudget,
    deleteBudget
  }
})