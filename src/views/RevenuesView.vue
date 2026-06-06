<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- En-tête -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-[32px] font-bold text-secondary">Revenus</h1>
          <p class="text-gray-500 mt-1">Gérez vos sources de revenus</p>
        </div>
        <button @click="openCreateModal" class="btn-primary flex items-center gap-2">
          <Plus class="w-5 h-5" />
          <span>Ajouter un revenu</span>
        </button>
      </div>

      <!-- Barre de recherche -->
      <div class="relative">
        <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Rechercher un revenu..."
          class="input-field pl-10"
        />
      </div>

      <!-- Liste des revenus -->
      <div v-if="loading" class="flex justify-center py-12">
        <Loader2 class="w-8 h-8 text-primary animate-spin" />
      </div>

      <div v-else-if="filteredRevenues.length === 0" class="card text-center py-12">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-success/10 mb-4">
          <TrendingUp class="w-8 h-8 text-success" />
        </div>
        <h3 class="text-lg font-semibold text-secondary mb-2">Aucun revenu</h3>
        <p class="text-gray-500 mb-6">Commencez par ajouter votre premier revenu</p>
        <button @click="openCreateModal" class="btn-primary">
          Ajouter un revenu
        </button>
      </div>

      <div v-else class="space-y-3">
        <div
          v-for="revenue in filteredRevenues"
          :key="revenue.id"
          class="card flex items-center justify-between hover:shadow-md transition-shadow"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
              <TrendingUp class="w-6 h-6 text-success" />
            </div>
            <div>
              <h3 class="font-semibold text-secondary">{{ revenue.description }}</h3>
              <p class="text-sm text-gray-500">{{ formatDate(revenue.revenueDate) }}</p>
              <p v-if="revenue.notes" class="text-xs text-gray-400 mt-1">{{ revenue.notes }}</p>
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <span class="text-lg font-bold text-success">+{{ formatCurrency(revenue.amount) }}</span>
            <div class="flex items-center gap-1">
              <button @click="openEditModal(revenue)" class="p-2 text-gray-400 hover:text-primary rounded-lg hover:bg-primary/5 transition-colors">
                <Pencil class="w-4 h-4" />
              </button>
              <button @click="confirmDelete(revenue)" class="p-2 text-gray-400 hover:text-danger rounded-lg hover:bg-red-50 transition-colors">
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <RevenueFormModal
        :show="showModal"
        :revenue="selectedRevenue"
        @close="closeModal"
        @save="handleSave"
      />

      <!-- Dialogue de confirmation -->
      <ConfirmDialog
        :show="showDeleteDialog"
        title="Supprimer le revenu"
        :message="'Êtes-vous sûr de vouloir supprimer le revenu «' + (revenueToDelete?.description ?? '') + '» ?'"
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
import RevenueFormModal from '@/components/revenues/RevenueFormModal.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { useRevenueStore } from '@/stores/revenues'
import { useFormat } from '@/composables/useFormat'
import { useNotification } from '@/composables/useNotification'
import type { Revenue, RevenueDTO } from '@/types'
import { Plus, Search, TrendingUp, Pencil, Trash2, Loader2 } from '@lucide/vue'

const revenueStore = useRevenueStore()
const { formatCurrency, formatDate } = useFormat()
const { success, error: notifyError } = useNotification()

const searchQuery = ref('')
const showModal = ref(false)
const selectedRevenue = ref<Revenue | null>(null)
const showDeleteDialog = ref(false)
const revenueToDelete = ref<Revenue | null>(null)

const loading = computed(() => revenueStore.loading)

const filteredRevenues = computed(() => {
  if (!searchQuery.value) return revenueStore.revenues
  const query = searchQuery.value.toLowerCase()
  return revenueStore.revenues.filter(r =>
    r.description.toLowerCase().includes(query) ||
    r.notes?.toLowerCase().includes(query)
  )
})

onMounted(() => {
  revenueStore.fetchRevenues()
})

function openCreateModal() {
  selectedRevenue.value = null
  showModal.value = true
}

function openEditModal(revenue: Revenue) {
  selectedRevenue.value = revenue
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedRevenue.value = null
}

async function handleSave(data: RevenueDTO, id?: number) {
  try {
    if (id) {
      await revenueStore.updateRevenue(id, data)
      success('Revenu modifié avec succès')
    } else {
      await revenueStore.createRevenue(data)
      success('Revenu ajouté avec succès')
    }
  } catch (err: any) {
    notifyError(err.response?.data?.message || 'Une erreur est survenue')
  }
}

function confirmDelete(revenue: Revenue) {
  revenueToDelete.value = revenue
  showDeleteDialog.value = true
}

async function handleDelete() {
  if (revenueToDelete.value) {
    try {
      await revenueStore.deleteRevenue(revenueToDelete.value.id)
      success('Revenu supprimé avec succès')
    } catch (err: any) {
      notifyError(err.response?.data?.message || 'Erreur lors de la suppression')
    }
  }
  showDeleteDialog.value = false
  revenueToDelete.value = null
}
</script>