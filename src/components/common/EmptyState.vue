<template>
  <div class="text-center py-12">
    <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
      <Inbox class="w-8 h-8 text-gray-400" />
    </div>
    <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ title }}</h3>
    <p class="text-sm text-gray-500 mb-6">{{ description }}</p>
    <button
      v-if="actionLabel"
      @click="$emit('action')"
      class="btn-primary"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { Inbox } from '@lucide/vue'

defineProps<{
  title: string
  description: string
  actionLabel?: string
}>()

defineEmits<{
  action: []
}>()
</script>