<template>
  <div class="card flex items-center justify-between">
    <div class="flex items-center gap-4">
      <div
        :class="[
          'w-12 h-12 rounded-xl flex items-center justify-center',
          transaction.type === 'REVENUE' ? 'bg-success/10' : 'bg-danger/10'
        ]"
      >
        <TrendingUp v-if="transaction.type === 'REVENUE'" class="w-6 h-6 text-success" />
        <TrendingDown v-else class="w-6 h-6 text-danger" />
      </div>
      <div>
        <div class="flex items-center gap-2">
          <h3 class="font-semibold text-secondary">{{ transaction.description }}</h3>
          <span
            :class="[
              'text-xs px-2 py-0.5 rounded-full font-medium',
              transaction.type === 'REVENUE' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
            ]"
          >
            {{ transaction.type === 'REVENUE' ? 'Revenu' : 'Dépense' }}
          </span>
        </div>
        <div class="flex items-center gap-2 mt-1">
          <span v-if="transaction.categoryName" class="text-xs text-gray-500">
            {{ transaction.categoryName }}
          </span>
          <span class="text-xs text-gray-400">{{ formatDate(transaction.date) }}</span>
        </div>
        <p v-if="transaction.notes" class="text-xs text-gray-400 mt-1">{{ transaction.notes }}</p>
      </div>
    </div>

    <span
      :class="[
        'text-lg font-bold',
        transaction.type === 'REVENUE' ? 'text-success' : 'text-danger'
      ]"
    >
      {{ transaction.type === 'REVENUE' ? '+' : '-' }}{{ formatCurrency(Math.abs(transaction.amount)) }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { Transaction } from '@/types'
import { useFormat } from '@/composables/useFormat'
import { TrendingUp, TrendingDown } from '@lucide/vue'

defineProps<{
  transaction: Transaction
}>()

const { formatCurrency, formatDate } = useFormat()
</script>