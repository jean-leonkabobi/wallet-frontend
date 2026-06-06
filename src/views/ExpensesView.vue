<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- En-tête -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-[32px] font-bold text-secondary">Dépenses</h1>
          <p class="text-gray-500 mt-1">Suivez toutes vos dépenses</p>
        </div>
        <button @click="openCreateModal" class="btn-primary flex items-center gap-2">
          <Plus class="w-5 h-5" />
          <span>Ajouter une dépense</span>
        </button>
      </div>

      <!-- Filtres -->
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Rechercher une dépense..."
            class="input-field pl-10"
          />
        </div>
        <select v-model="categoryFilter" class="input-field sm:w-48">
          <option value="">Toutes les catégories</option>
          <option
            v-for="category in categoryStore.categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>

      <!-- Liste des dépenses -->
      <div v-if="loading" class="flex justify-center py-12">
        <Loader2 class="w-8 h-8 text-primary animate-spin" />
      </div>

      <div v-else-if="filteredExpenses.length === 0" class="card text-center py-12">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-danger/10 mb-4">
          <TrendingDown class="w-8 h-8 text-danger" />
        </div>
        <h3 class="text-lg font-semibold text-secondary mb-2">Aucune dépense</h3>
        <p class="text-gray-500 mb-6">Commencez par ajouter votre première dépense</p>
        <button @click="openCreateModal" class="btn-primary">
          Ajouter une dépense
        </button>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="expense in filteredExpenses"
          :key="expense.id"
          class="card flex items-center justify-between hover:shadow-md transition-shadow"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-danger/10 flex items-center justify-center">
              <TrendingDown class="w-6 h-6 text-danger" />
            </div>
            <div>
              <h3 class="font-semibold text-secondary">{{ expense.description }}</h3>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  {{ categoryStore.getCategoryName(expense.categoryId) }}
                </span>
                <span class="text-sm text-gray-500">{{ formatDate(expense.expenseDate) }}</span>
              </div>
              <p v-if="expense.notes" class="text-xs text-gray-400 mt-1">{{ expense.notes }}</p>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <span class="text-lg font-bold text-danger">-{{ formatCurrency(expense.amount) }}</span>
            <div class="flex items-center gap-1">
              <button @click="openEditModal(expense)" class="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-primary/5 transition-colors">
                <Pencil class="w-4 h-4" />
              </button>
              <button @click="confirmDelete(expense)" class="p-2 text-gray-400 hover:text-danger rounded-lg hover:bg-red-50 transition-colors">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <ExpenseFormModal
        :show="showModal"
        :expense="selectedExpense"
        @close="closeModal"
        @save="handleSave"
      />

      <!-- Dialogue de confirmation -->
      <ConfirmDialog
        :show="showDeleteDialog"
        title="Supprimer la dépense"
        :message="'Êtes-vous sûr de vouloir supprimer la dépense «' + (expenseToDelete?.description ?? '') + '» ?'"
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
import ExpenseFormModal from '@/components/expenses/ExpenseFormModal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { useExpenseStore } from '@/stores/expenses'
import { useCategoryStore } from '@/stores/categories'
import { useFormat } from '@/composables/useFormat'
import { useNotification } from '@/composables/useNotification'
import type { Expense, ExpenseDTO } from '@/types'
import { Plus, Search, TrendingDown, Pencil, Trash2, Loader2 } from '@lucide/vue'

const expenseStore = useExpenseStore()
const categoryStore = useCategoryStore()
const { formatCurrency, formatDate } = useFormat()
const { success, error: notifyError } = useNotification()

const searchQuery = ref('')
const categoryFilter = ref('')
const showModal = ref(false)
const selectedExpense = ref<Expense | null>(null)
const showDeleteDialog = ref(false)
const expenseToDelete = ref<Expense | null>(null)

const loading = computed(() => expenseStore.loading)

const filteredExpenses = computed(() => {
  let filtered = expenseStore.expenses

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(e =>
      e.description.toLowerCase().includes(query) ||
      e.notes?.toLowerCase().includes(query)
    )
  }

  if (categoryFilter.value) {
    filtered = filtered.filter(e => e.categoryId === Number(categoryFilter.value))
  }

  return filtered
})

onMounted(() => {
  expenseStore.fetchExpenses()
  categoryStore.fetchCategories()
})

function openCreateModal() {
  selectedExpense.value = null
  showModal.value = true
}

function openEditModal(expense: Expense) {
  selectedExpense.value = expense
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedExpense.value = null
}

async function handleSave(data: ExpenseDTO, id?: number) {
  try {
    if (id) {
      await expenseStore.updateExpense(id, data)
      success('Dépense modifiée avec succès')
    } else {
      await expenseStore.createExpense(data)
      success('Dépense ajoutée avec succès')
    }
  } catch (err: any) {
    notifyError(err.response?.data?.message || 'Une erreur est survenue')
  }
}

function confirmDelete(expense: Expense) {
  expenseToDelete.value = expense
  showDeleteDialog.value = true
}

async function handleDelete() {
  if (expenseToDelete.value) {
    try {
      await expenseStore.deleteExpense(expenseToDelete.value.id)
      success('Dépense supprimée avec succès')
    } catch (err: any) {
      notifyError(err.response?.data?.message || 'Erreur lors de la suppression')
    }
  }
  showDeleteDialog.value = false
  expenseToDelete.value = null
}
</script>