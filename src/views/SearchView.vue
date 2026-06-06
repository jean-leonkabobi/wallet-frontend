<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- En-tête -->
      <div>
        <h1 class="text-[32px] font-bold text-secondary">Recherche</h1>
        <p class="text-gray-500 mt-1">Recherchez et exportez vos transactions</p>
      </div>

      <!-- Filtres -->
      <div class="card space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-secondary mb-2">Type</label>
            <select v-model="filters.type" class="input-field">
              <option value="">Tout</option>
              <option value="REVENUE">Revenus</option>
              <option value="EXPENSE">Dépenses</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary mb-2">Catégorie</label>
            <select v-model="filters.categoryId" class="input-field">
              <option value="">Toutes</option>
              <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary mb-2">Date début</label>
            <input type="date" v-model="filters.startDate" class="input-field" />
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary mb-2">Date fin</label>
            <input type="date" v-model="filters.endDate" class="input-field" />
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary mb-2">Mot-clé</label>
            <input type="text" v-model="filters.keyword" placeholder="Rechercher..." class="input-field" />
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary mb-2">Montant min</label>
            <input type="number" v-model="filters.minAmount" placeholder="0.00" step="0.01" class="input-field" />
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary mb-2">Montant max</label>
            <input type="number" v-model="filters.maxAmount" placeholder="0.00" step="0.01" class="input-field" />
          </div>

          <div>
            <label class="block text-sm font-medium text-secondary mb-2">Trier par</label>
            <select v-model="filters.sortBy" class="input-field">
              <option value="date">Date</option>
              <option value="amount">Montant</option>
              <option value="description">Description</option>
            </select>
          </div>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-border">
          <div class="flex items-center gap-2">
            <button @click="handleSearch" :disabled="loading" class="btn-primary flex items-center gap-2">
              <Search class="w-4 h-4" />
              <span>Rechercher</span>
            </button>
            <button @click="resetFilters" class="btn-secondary">Réinitialiser</button>
          </div>

          <div class="flex items-center gap-2">
            <button @click="exportData('CSV')" :disabled="loading || transactions.length === 0" class="btn-secondary flex items-center gap-2">
              <Download class="w-4 h-4" />
              <span>CSV</span>
            </button>
            <button @click="exportData('PDF')" :disabled="loading || transactions.length === 0" class="btn-primary flex items-center gap-2">
              <FileText class="w-4 h-4" />
              <span>PDF</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Résultats -->
      <div v-if="loading" class="flex justify-center py-12">
        <Loader2 class="w-8 h-8 text-primary animate-spin" />
      </div>

      <div v-else-if="hasSearched && transactions.length === 0" class="card text-center py-12">
        <Search class="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 class="text-lg font-semibold text-secondary mb-2">Aucun résultat</h3>
        <p class="text-gray-500">Essayez de modifier vos critères de recherche</p>
      </div>

      <div v-else-if="transactions.length > 0" class="space-y-3">
        <p class="text-sm text-gray-500">{{ transactions.length }} transaction(s) trouvée(s)</p>
        <TransactionCard
          v-for="transaction in transactions"
          :key="`${transaction.type}-${transaction.id}`"
          :transaction="transaction"
        />
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import TransactionCard from '@/components/search/TransactionCard.vue'
import { useSearchStore } from '@/stores/search'
import { useCategoryStore } from '@/stores/categories'
import { useNotification } from '@/composables/useNotification'
import type { TransactionSearch, ExportRequest } from '@/types'
import { Search, Download, FileText, Loader2 } from '@lucide/vue'

const searchStore = useSearchStore()
const categoryStore = useCategoryStore()
const { error: notifyError, success } = useNotification()

const hasSearched = ref(false)
const loading = searchStore.loading
const transactions = searchStore.transactions

const filters = reactive<TransactionSearch>({
  type: undefined,
  keyword: '',
  categoryId: undefined,
  startDate: '',
  endDate: '',
  minAmount: undefined,
  maxAmount: undefined,
  sortBy: 'date',
  sortDirection: 'desc'
})

onMounted(() => {
  categoryStore.fetchCategories()
})

async function handleSearch() {
  const searchDTO: TransactionSearch = {
    keyword: filters.keyword || undefined,
    sortBy: filters.sortBy,
    sortDirection: filters.sortDirection
  }

  if (filters.type) searchDTO.type = filters.type
  if (filters.categoryId) searchDTO.categoryId = Number(filters.categoryId)
  if (filters.startDate) searchDTO.startDate = filters.startDate
  if (filters.endDate) searchDTO.endDate = filters.endDate
  if (filters.minAmount) searchDTO.minAmount = Number(filters.minAmount)
  if (filters.maxAmount) searchDTO.maxAmount = Number(filters.maxAmount)

  hasSearched.value = true
  await searchStore.search(searchDTO)
}

function resetFilters() {
  filters.type = undefined
  filters.keyword = ''
  filters.categoryId = undefined
  filters.startDate = ''
  filters.endDate = ''
  filters.minAmount = undefined
  filters.maxAmount = undefined
  filters.sortBy = 'date'
  filters.sortDirection = 'desc'
  hasSearched.value = false
  searchStore.transactions = []
}

async function exportData(format: 'PDF' | 'CSV') {
  const now = new Date().toISOString().split('T')[0]!

  const request: ExportRequest = {
    startDate: filters.startDate || now,
    endDate: filters.endDate || now,
    format,
    type: filters.type || 'ALL'
  }

  if (filters.categoryId) {
    request.categoryId = Number(filters.categoryId)
  }

  try {
    await searchStore.exportData(request)
    success(`Export ${format} réussi`)
  } catch (err: any) {
    notifyError("Erreur lors de l'export")
  }
}
</script>