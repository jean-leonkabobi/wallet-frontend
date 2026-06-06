<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/40" @click="$emit('close')"></div>
      
      <div class="relative bg-surface rounded-2xl shadow-xl p-6 max-w-lg w-full mx-4">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-secondary">
            {{ isEditing ? 'Modifier la dépense' : 'Ajouter une dépense' }}
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
              placeholder="Ex: Courses au supermarché"
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
            <label for="category" class="block text-sm font-medium text-secondary mb-2">Catégorie</label>
            <select id="category" v-model="form.categoryId" required class="input-field">
              <option value="" disabled>Sélectionner une catégorie</option>
              <option
                v-for="category in categoryStore.categories"
                :key="category.id"
                :value="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>

          <div>
            <label for="date" class="block text-sm font-medium text-secondary mb-2">Date</label>
            <input
              type="date"
              id="date"
              v-model="form.expenseDate"
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

          <div v-if="errorMsg" class="flex items-center gap-2 bg-red-50 text-danger px-4 py-3 rounded-xl text-sm">
            <AlertCircle class="w-4 h-4 flex-shrink-0" />
            <span>{{ errorMsg }}</span>
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
import { ref, watch, onMounted } from 'vue'
import type { Expense, ExpenseDTO } from '@/types'
import { useCategoryStore } from '@/stores/categories'
import { X, AlertCircle, Loader2 } from '@lucide/vue'

const props = defineProps<{
  show: boolean
  expense?: Expense | null
}>()

const emit = defineEmits<{
  close: []
  save: [data: ExpenseDTO, id?: number]
}>()

const categoryStore = useCategoryStore()

const isEditing = ref(false)
const loading = ref(false)
const errorMsg = ref('')

function getDefaultForm(): ExpenseDTO {
  return {
    description: '',
    amount: 0,
    expenseDate: new Date().toISOString().split('T')[0]!,
    categoryId: 0,
    notes: ''
  }
}

const form = ref<ExpenseDTO>(getDefaultForm())

onMounted(() => {
  categoryStore.fetchCategories()
})

function resetForm() {
  form.value = getDefaultForm()
}

function setFormFromExpense(expense: Expense) {
  form.value = {
    description: expense.description,
    amount: expense.amount,
    expenseDate: expense.expenseDate,
    categoryId: expense.categoryId,
    notes: expense.notes
  }
}

watch(() => props.expense, (newVal) => {
  if (newVal) {
    isEditing.value = true
    setFormFromExpense(newVal)
  } else {
    isEditing.value = false
    resetForm()
  }
})

function handleSubmit() {
  loading.value = true
  errorMsg.value = ''
  try {
    emit('save', { ...form.value }, props.expense?.id)
  } catch (err: any) {
    errorMsg.value = err.response?.data?.message || 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}
</script>