<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="$emit('cancel')"></div>
      <div class="relative bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
        <div class="flex items-center gap-3 mb-4">
          <div class="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle class="w-5 h-5 text-red-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
        </div>
        <p class="text-sm text-gray-600 mb-6">{{ message }}</p>
        <div class="flex justify-end gap-3">
          <button @click="$emit('cancel')" class="btn-secondary">Annuler</button>
          <button @click="$emit('confirm')" class="btn-danger">
            {{ confirmLabel || 'Confirmer' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { AlertTriangle } from '@lucide/vue'

defineProps<{
  show: boolean
  title: string
  message: string
  confirmLabel?: string
}>()

defineEmits<{
  confirm: []
  cancel: []
}>()
</script>