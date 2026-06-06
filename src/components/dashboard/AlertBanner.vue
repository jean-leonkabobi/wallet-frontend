<template>
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
</template>

<script setup lang="ts">
import type { BudgetAlert } from '@/types'
import { AlertTriangle, AlertCircle, XCircle } from '@lucide/vue'

defineProps<{
  alerts: BudgetAlert[]
}>()

const alertClasses: Record<string, string> = {
  WARNING: 'bg-warning/10 text-warning border border-warning/20',
  CRITICAL: 'bg-danger/10 text-danger border border-danger/20',
  EXCEEDED: 'bg-danger/20 text-danger border border-danger/30'
}
</script>