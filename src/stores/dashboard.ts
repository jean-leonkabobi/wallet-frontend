import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { DashboardData } from '@/types'
import DashboardService from '@/services/dashboard.service'

export const useDashboardStore = defineStore('dashboard', () => {
  const dashboardData = ref<DashboardData | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchDashboard(month?: number, year?: number) {
    loading.value = true
    error.value = null
    try {
      dashboardData.value = await DashboardService.getDashboard(month, year)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors du chargement du tableau de bord'
    } finally {
      loading.value = false
    }
  }

  return {
    dashboardData,
    loading,
    error,
    fetchDashboard
  }
})