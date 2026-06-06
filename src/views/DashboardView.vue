<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- En-tête -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-[32px] font-bold text-secondary">Tableau de bord</h1>
          <p class="text-gray-500 mt-1">Vue d'ensemble de vos finances</p>
        </div>
        <div class="card px-4 py-2">
          <span class="text-sm text-gray-600">{{ currentMonth }}</span>
        </div>
      </div>

      <!-- Alertes budget -->
      <AlertBanner :alerts="alerts" />

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-12">
        <Loader2 class="w-8 h-8 text-primary animate-spin" />
      </div>

      <template v-else-if="dashboardData">
        <!-- Carte solde principal -->
        <div class="balance-card">
          <div class="flex items-center justify-between mb-4">
            <span class="text-white/80 text-sm">Solde total</span>
            <div class="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Wallet class="w-6 h-6 text-white" />
            </div>
          </div>
          <p class="text-4xl font-bold mb-2">{{ formatCurrency(dashboardData.currentBalance) }}</p>
          <div class="flex items-center gap-2 text-white/70 text-sm">
            <TrendingUp class="w-4 h-4" />
            <span>Taux d'épargne : {{ formatPercentage(dashboardData.savingsRate) }}</span>
          </div>
        </div>

        <!-- Grille de statistiques -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="stat-card">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                <TrendingUp class="w-5 h-5 text-success" />
              </div>
              <span class="text-sm font-medium text-gray-500">Revenus du mois</span>
            </div>
            <p class="text-2xl font-bold text-success">
              {{ formatCurrency(dashboardData.totalRevenuesMonth) }}
            </p>
          </div>

          <div class="stat-card">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center">
                <TrendingDown class="w-5 h-5 text-danger" />
              </div>
              <span class="text-sm font-medium text-gray-500">Dépenses du mois</span>
            </div>
            <p class="text-2xl font-bold text-danger">
              {{ formatCurrency(dashboardData.totalExpensesMonth) }}
            </p>
          </div>

          <div class="stat-card">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Target class="w-5 h-5 text-primary" />
              </div>
              <span class="text-sm font-medium text-gray-500">Épargne du mois</span>
            </div>
            <p class="text-2xl font-bold text-primary">
              {{ formatCurrency(dashboardData.totalRevenuesMonth - dashboardData.totalExpensesMonth) }}
            </p>
          </div>
        </div>

        <!-- Graphiques -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ExpensesByCategoryChart :data="dashboardData.expensesByCategory" />
          <MonthlyEvolutionChart :data="dashboardData.monthlyEvolution" />
        </div>
      </template>

      <!-- Erreur -->
      <div v-else class="card text-center py-12">
        <AlertCircle class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-secondary mb-2">Données indisponibles</h3>
        <p class="text-gray-500 mb-6">Impossible de charger le tableau de bord</p>
        <button @click="loadDashboard" class="btn-primary">Réessayer</button>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import ExpensesByCategoryChart from '@/components/dashboard/ExpensesByCategoryChart.vue'
import MonthlyEvolutionChart from '@/components/dashboard/MonthlyEvolutionChart.vue'
import AlertBanner from '@/components/dashboard/AlertBanner.vue'
import { useDashboardStore } from '@/stores/dashboard'
import { useFormat } from '@/composables/useFormat'
import type { BudgetAlert } from '@/types'
import { Wallet, TrendingUp, TrendingDown, Target, Loader2, AlertCircle } from '@lucide/vue'

const dashboardStore = useDashboardStore()
const { formatCurrency, formatPercentage, getMonthName } = useFormat()

const loading = computed(() => dashboardStore.loading)
const dashboardData = computed(() => dashboardStore.dashboardData)

const alerts = ref<BudgetAlert[]>([])

const currentMonth = computed(() => {
  const now = new Date()
  return `${getMonthName(now.getMonth() + 1)} ${now.getFullYear()}`
})

async function loadDashboard() {
  const now = new Date()
  await dashboardStore.fetchDashboard(now.getMonth() + 1, now.getFullYear())
}

onMounted(() => {
  loadDashboard()
})
</script>