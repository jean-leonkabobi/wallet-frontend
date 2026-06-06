<template>
  <div class="flex flex-col items-center justify-center p-8">
    <div class="w-10 h-10 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
    <p v-if="message" class="mt-4 text-sm text-gray-500">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string
}>()
</script>