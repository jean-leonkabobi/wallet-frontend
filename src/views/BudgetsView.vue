<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- En-tête -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-[32px] font-bold text-secondary">Budgets</h1>
          <p class="text-gray-500 mt-1">Gérez vos budgets mensuels</p>
        </div>
        <button @click="openCreateModal" class="btn-primary flex items-center gap-2">
          <Plus class="w-5 h-5" />
          <span>Nouveau budget</span>
        </button>
      </div>

      <!-- Sélecteur mois/année -->
      <div class="flex items-center gap-4">
        <select v-model="selectedMonth" @change="loadData" class="input-field w-40">
          <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
        </select>
        <select v-model="selectedYear" @change="loadData" class="input-field w-28">
          <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>

      <!-- Alertes -->
      <div v-if="alerts.length > 0" class="space-y-2">
        <div
          v-for="alert in alerts"
          :key="alert.budgetId"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium',
            alertClasses[alert.alertType]
          ]"
        >
          <AlertTriangle v-if="alert.alertType === 'WARNING'" class="w-5 h-5 flex-shrink-0" />
          <AlertCircle v-else-if="alert.alertType === 'CRITICAL'" class="w-5 h-5 flex-shrink-0" />
          <XCircle v-else class="w-5 h-5 flex-shrink-0" />
          <span>{{ alert.message }}</span>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-12">
        <Loader2 class="w-8 h-8 text-primary animate-spin" />
      </div>

      <!-- Vide -->
      <div v-else-if="budgets.length === 0" class="card text-center py-12">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
          <Target class="w-8 h-8 text-primary" />
        </div>
        <h3 class="text-lg font-semibold text-secondary mb-2">Aucun budget</h3>
        <p class="text-gray-500 mb-6">Créez votre premier budget mensuel</p>
        <button @click="openCreateModal" class="btn-primary">Nouveau budget</button>
      </div>

      <!-- Liste des budgets -->
      <div v-else class="space-y-4">
        <div v-for="budget in budgets" :key="budget.id" class="relative">
          <BudgetProgressBar
            :status="getStatusForBudget(budget.id)"
            :label="getBudgetLabel(budget)"
          />
          <div class="absolute top-4 right-4 flex items-center gap-1">
            <button @click="openEditModal(budget)" class="p-2 text-gray-400 hover:text-primary rounded-lg transition-colors">
              <Pencil class="w-4 h-4" />
            </button>
            <button @click="confirmDelete(budget)" class="p-2 text-gray-400 hover:text-danger rounded-lg transition-colors">
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <BudgetFormModal
        :show="showModal"
        :budget="selectedBudget"
        @close="closeModal"
        @save="handleSave"
      />

      <!-- Dialogue de confirmation -->
      <ConfirmDialog
        :show="showDeleteDialog"
        title="Supprimer le budget"
        :message="'Êtes-vous sûr de vouloir supprimer ce budget ?'"
        confirmLabel="Supprimer"
        @confirm="handleDelete"
        @cancel="showDeleteDialog = false"
      />
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import BudgetFormModal from '@/components/budgets/BudgetFormModal.vue'
import BudgetProgressBar from '@/components/budgets/BudgetProgressBar.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { useBudgetStore } from '@/stores/budgets'
import { useCategoryStore } from '@/stores/categories'
import { useNotification } from '@/composables/useNotification'
import type { Budget, BudgetDTO, BudgetStatus } from '@/types'
import { Plus, Target, Pencil, Trash2, Loader2, AlertTriangle, AlertCircle, XCircle } from '@lucide/vue'

const budgetStore = useBudgetStore()
const categoryStore = useCategoryStore()
const { success, error: notifyError } = useNotification()

const now = new Date()
const selectedMonth = ref(now.getMonth() + 1)
const selectedYear = ref(now.getFullYear())

const showModal = ref(false)
const selectedBudget = ref<Budget | null>(null)
const showDeleteDialog = ref(false)
const budgetToDelete = ref<Budget | null>(null)

const months = [
  { value: 1, label: 'Janvier' }, { value: 2, label: 'Février' }, { value: 3, label: 'Mars' },
  { value: 4, label: 'Avril' }, { value: 5, label: 'Mai' }, { value: 6, label: 'Juin' },
  { value: 7, label: 'Juillet' }, { value: 8, label: 'Août' }, { value: 9, label: 'Septembre' },
  { value: 10, label: 'Octobre' }, { value: 11, label: 'Novembre' }, { value: 12, label: 'Décembre' }
]

const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() + i)

const loading = computed(() => budgetStore.loading)
const budgets = computed(() => budgetStore.budgets)
const alerts = computed(() => budgetStore.alerts)
const statuses = computed(() => budgetStore.budgetStatuses)

const alertClasses: Record<string, string> = {
  WARNING: 'bg-warning/10 text-warning border border-warning/20',
  CRITICAL: 'bg-danger/10 text-danger border border-danger/20',
  EXCEEDED: 'bg-danger/20 text-danger border border-danger/30'
}

async function loadData() {
  await Promise.all([
    budgetStore.fetchBudgets(selectedMonth.value, selectedYear.value),
    budgetStore.fetchStatuses(selectedMonth.value, selectedYear.value),
    budgetStore.fetchAlerts(selectedMonth.value, selectedYear.value)
  ])
}

onMounted(() => {
  loadData()
  categoryStore.fetchCategories()
})

function getStatusForBudget(budgetId: number): BudgetStatus {
  return statuses.value.find(s => s.budgetId === budgetId) || {
    budgetId,
    budgetAmount: 0,
    spentAmount: 0,
    remainingAmount: 0,
    percentageUsed: 0,
    status: 'OK'
  }
}

function getBudgetLabel(budget: Budget): string {
  if (budget.categoryId) {
    const cat = categoryStore.categories.find(c => c.id === budget.categoryId)
    return cat ? `Budget ${cat.name}` : 'Budget par catégorie'
  }
  return 'Budget global'
}

function openCreateModal() {
  selectedBudget.value = null
  showModal.value = true
}

function openEditModal(budget: Budget) {
  selectedBudget.value = budget
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedBudget.value = null
}

async function handleSave(data: BudgetDTO, id?: number) {
  try {
    if (id) {
      await budgetStore.updateBudget(id, data)
      success('Budget modifié avec succès')
    } else {
      await budgetStore.createBudget(data)
      success('Budget créé avec succès')
    }
    await loadData()
  } catch (err: any) {
    notifyError(err.response?.data?.message || 'Une erreur est survenue')
  }
}

function confirmDelete(budget: Budget) {
  budgetToDelete.value = budget
  showDeleteDialog.value = true
}

async function handleDelete() {
  if (budgetToDelete.value) {
    try {
      await budgetStore.deleteBudget(budgetToDelete.value.id)
      success('Budget supprimé avec succès')
      await loadData()
    } catch (err: any) {
      notifyError(err.response?.data?.message || 'Erreur lors de la suppression')
    }
  }
  showDeleteDialog.value = false
  budgetToDelete.value = null
}
</script>