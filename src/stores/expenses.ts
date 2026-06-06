import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Expense, ExpenseDTO } from '@/types'
import ExpenseService from '@/services/expense.service'

export const useExpenseStore = defineStore('expenses', () => {
  const expenses = ref<Expense[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchExpenses() {
    loading.value = true
    error.value = null
    try {
      expenses.value = await ExpenseService.getAll()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des dépenses'
    } finally {
      loading.value = false
    }
  }

  async function createExpense(data: ExpenseDTO) {
    loading.value = true
    error.value = null
    try {
      const newExpense = await ExpenseService.create(data)
      expenses.value.unshift(newExpense)
      return newExpense
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la création de la dépense'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateExpense(id: number, data: ExpenseDTO) {
    loading.value = true
    error.value = null
    try {
      const updatedExpense = await ExpenseService.update(id, data)
      const index = expenses.value.findIndex(e => e.id === id)
      if (index !== -1) {
        expenses.value[index] = updatedExpense
      }
      return updatedExpense
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la modification de la dépense'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteExpense(id: number) {
    loading.value = true
    error.value = null
    try {
      await ExpenseService.delete(id)
      expenses.value = expenses.value.filter(e => e.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la suppression de la dépense'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    expenses,
    loading,
    error,
    fetchExpenses,
    createExpense,
    updateExpense,
    deleteExpense
  }
})