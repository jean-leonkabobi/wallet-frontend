<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="$emit('close')"></div>
      
      <div class="relative bg-surface rounded-2xl shadow-xl p-6 max-w-lg w-full mx-4">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-secondary">
            {{ isEditing ? 'Modifier le revenu' : 'Ajouter un revenu' }}
          </h2>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <label for="description" class="block text-sm font-medium text-secondary mb-2">Description</label>
            <input
              type="text"
              id="description"
              v-model="form.description"
              required
              placeholder="Ex: Salaire janvier"
              class="input-field"
            />
          </div>

          <div>
            <label for="amount" class="block text-sm font-medium text-secondary mb-2">Montant (€)</label>
            <input
              type="number"
              id="amount"
              v-model="form.amount"
              required
              min="0.01"
              step="0.01"
              placeholder="0.00"
              class="input-field"
            />
          </div>

          <div>
            <label for="date" class="block text-sm font-medium text-secondary mb-2">Date</label>
            <input
              type="date"
              id="date"
              v-model="form.revenueDate"
              required
              class="input-field"
            />
          </div>

          <div>
            <label for="notes" class="block text-sm font-medium text-secondary mb-2">Notes (optionnel)</label>
            <textarea
              id="notes"
              v-model="form.notes"
              rows="3"
              placeholder="Notes supplémentaires..."
              class="input-field"
            ></textarea>
          </div>

          <div v-if="error" class="flex items-center gap-2 bg-red-50 text-danger px-4 py-3 rounded-xl text-sm">
            <AlertCircle class="w-4 h-4 flex-shrink-0" />
            <span>{{ error }}</span>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button type="button" @click="$emit('close')" class="btn-secondary">Annuler</button>
            <button type="submit" :disabled="loading" class="btn-primary flex items-center gap-2">
              <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
              <span>{{ isEditing ? 'Modifier' : 'Ajouter' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Revenue, RevenueDTO } from '@/types'
import { X, AlertCircle, Loader2 } from '@lucide/vue'

const props = defineProps<{
  show: boolean
  revenue?: Revenue | null
}>()

const emit = defineEmits<{
  close: []
  save: [data: RevenueDTO, id?: number]
}>()

const isEditing = ref(false)
const loading = ref(false)
const error = ref('')

const form = ref<RevenueDTO>({
  description: '',
  amount: 0,
  revenueDate: new Date().toISOString().split('T')[0]!,
  notes: ''
})

function resetForm() {
  form.value = {
    description: '',
    amount: 0,
    revenueDate: new Date().toISOString().split('T')[0]!,
    notes: ''
  }
}

function setFormFromRevenue(revenue: Revenue) {
  form.value = {
    description: revenue.description,
    amount: revenue.amount,
    revenueDate: revenue.revenueDate,
    notes: revenue.notes
  }
}

watch(() => props.revenue, (newVal) => {
  if (newVal) {
    isEditing.value = true
    setFormFromRevenue(newVal)
  } else {
    isEditing.value = false
    resetForm()
  }
})

function handleSubmit() {
  loading.value = true
  error.value = ''
  try {
    emit('save', { ...form.value }, props.revenue?.id)
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}
</script>