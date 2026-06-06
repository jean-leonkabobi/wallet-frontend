import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Revenue, RevenueDTO } from '@/types'
import RevenueService from '@/services/revenue.service'

export const useRevenueStore = defineStore('revenues', () => {
  const revenues = ref<Revenue[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchRevenues() {
    loading.value = true
    error.value = null
    try {
      revenues.value = await RevenueService.getAll()
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement des revenus'
    } finally {
      loading.value = false
    }
  }

  async function createRevenue(data: RevenueDTO) {
    loading.value = true
    error.value = null
    try {
      const newRevenue = await RevenueService.create(data)
      revenues.value.unshift(newRevenue)
      return newRevenue
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la création du revenu'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateRevenue(id: number, data: RevenueDTO) {
    loading.value = true
    error.value = null
    try {
      const updatedRevenue = await RevenueService.update(id, data)
      const index = revenues.value.findIndex(r => r.id === id)
      if (index !== -1) {
        revenues.value[index] = updatedRevenue
      }
      return updatedRevenue
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la modification du revenu'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteRevenue(id: number) {
    loading.value = true
    error.value = null
    try {
      await RevenueService.delete(id)
      revenues.value = revenues.value.filter(r => r.id !== id)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la suppression du revenu'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    revenues,
    loading,
    error,
    fetchRevenues,
    createRevenue,
    updateRevenue,
    deleteRevenue
  }
})