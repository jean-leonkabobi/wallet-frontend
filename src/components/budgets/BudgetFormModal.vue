<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="$emit('close')"></div>
      
      <div class="relative bg-surface rounded-2xl shadow-xl p-6 max-w-lg w-full mx-4">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-secondary">
            {{ isEditing ? 'Modifier le budget' : 'Nouveau budget' }}
          </h2>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
            <X class="w-5 h-5" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
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

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="month" class="block text-sm font-medium text-secondary mb-2">Mois</label>
              <select id="month" v-model="form.month" required class="input-field">
                <option v-for="m in months" :key="m.value" :value="m.value">{{ m.label }}</option>
              </select>
            </div>
            <div>
              <label for="year" class="block text-sm font-medium text-secondary mb-2">Année</label>
              <select id="year" v-model="form.year" required class="input-field">
                <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
              </select>
            </div>
          </div>

          <div>
            <label for="category" class="block text-sm font-medium text-secondary mb-2">
              Catégorie <span class="text-gray-400 font-normal">(optionnel - laisser vide pour budget global)</span>
            </label>
            <select id="category" v-model="form.categoryId" class="input-field">
              <option :value="undefined">Budget global</option>
              <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div>
            <label for="threshold" class="block text-sm font-medium text-secondary mb-2">
              Seuil d'alerte (%)
            </label>
            <input
              type="number"
              id="threshold"
              v-model="form.alertThreshold"
              min="1"
              max="100"
              placeholder="80"
              class="input-field"
            />
          </div>

          <div v-if="errorMsg" class="flex items-center gap-2 bg-red-50 text-danger px-4 py-3 rounded-xl text-sm">
            <AlertCircle class="w-4 h-4 flex-shrink-0" />
            <span>{{ errorMsg }}</span>
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <button type="button" @click="$emit('close')" class="btn-secondary">Annuler</button>
            <button type="submit" :disabled="loading" class="btn-primary flex items-center gap-2">
              <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
              <span>{{ isEditing ? 'Modifier' : 'Créer' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import type { Budget, BudgetDTO } from '@/types'
import { useCategoryStore } from '@/stores/categories'
import { X, AlertCircle, Loader2 } from '@lucide/vue'

const props = defineProps<{
  show: boolean
  budget?: Budget | null
}>()

const emit = defineEmits<{
  close: []
  save: [data: BudgetDTO, id?: number]
}>()

const categoryStore = useCategoryStore()

const now = new Date()
const isEditing = ref(false)
const loading = ref(false)
const errorMsg = ref('')

const months = [
  { value: 1, label: 'Janvier' }, { value: 2, label: 'Février' }, { value: 3, label: 'Mars' },
  { value: 4, label: 'Avril' }, { value: 5, label: 'Mai' }, { value: 6, label: 'Juin' },
  { value: 7, label: 'Juillet' }, { value: 8, label: 'Août' }, { value: 9, label: 'Septembre' },
  { value: 10, label: 'Octobre' }, { value: 11, label: 'Novembre' }, { value: 12, label: 'Décembre' }
]

const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() + i)

function getDefaultForm(): BudgetDTO {
  return {
    amount: 0,
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    categoryId: undefined,
    alertThreshold: 80,
    isActive: true
  }
}

const form = ref<BudgetDTO>(getDefaultForm())

onMounted(() => {
  categoryStore.fetchCategories()
})

function resetForm() {
  form.value = getDefaultForm()
}

function setFormFromBudget(budget: Budget) {
  form.value = {
    amount: budget.amount,
    month: budget.month,
    year: budget.year,
    categoryId: budget.categoryId ?? undefined,
    alertThreshold: budget.alertThreshold,
    isActive: budget.isActive
  }
}

watch(() => props.budget, (newVal) => {
  if (newVal) {
    isEditing.value = true
    setFormFromBudget(newVal)
  } else {
    isEditing.value = false
    resetForm()
  }
})

function handleSubmit() {
  loading.value = true
  errorMsg.value = ''
  try {
    emit('save', { ...form.value }, props.budget?.id)
  } catch (err: any) {
    errorMsg.value = err.response?.data?.message || 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}
</script>