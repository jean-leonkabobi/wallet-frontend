<template>
  <div class="card">
    <div class="flex items-center justify-between mb-3">
      <h4 class="font-semibold text-secondary">{{ statusLabel }}</h4>
      <span :class="['text-sm font-medium', statusColor]">{{ statusText }}</span>
    </div>
    
    <div class="w-full bg-gray-100 rounded-full h-3 mb-2">
      <div
        :class="['h-3 rounded-full transition-all duration-500', barColor]"
        :style="{ width: `${Math.min(percentage, 100)}%` }"
      ></div>
    </div>
    
    <div class="flex justify-between text-sm text-gray-500">
      <span>{{ formatCurrency(spentAmount) }} dépensés</span>
      <span>{{ formatCurrency(remainingAmount) }} restants</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BudgetStatus } from '@/types'
import { useFormat } from '@/composables/useFormat'

const props = defineProps<{
  status: BudgetStatus
  label?: string
}>()

const { formatCurrency } = useFormat()

const percentage = computed(() => props.status.percentageUsed)
const spentAmount = computed(() => props.status.spentAmount)
const remainingAmount = computed(() => props.status.remainingAmount)

const statusLabel = computed(() => props.label || 'Budget')

const statusColor = computed(() => {
  switch (props.status.status) {
    case 'EXCEEDED': return 'text-danger'
    case 'CRITICAL': return 'text-danger'
    case 'WARNING': return 'text-warning'
    default: return 'text-success'
  }
})

const statusText = computed(() => {
  switch (props.status.status) {
    case 'EXCEEDED': return 'Dépassé !'
    case 'CRITICAL': return `${percentage.value.toFixed(0)}% utilisé`
    case 'WARNING': return `${percentage.value.toFixed(0)}% utilisé`
    default: return 'OK'
  }
})

const barColor = computed(() => {
  switch (props.status.status) {
    case 'EXCEEDED': return 'bg-danger'
    case 'CRITICAL': return 'bg-danger'
    case 'WARNING': return 'bg-warning'
    default: return 'bg-success'
  }
})
</script>