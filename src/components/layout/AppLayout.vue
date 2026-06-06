<template>
  <div class="min-h-screen flex flex-col bg-background">
    <AppHeader />
    <div class="flex flex-1">
      <AppSidebar />
      <main class="flex-1 p-6 lg:p-8 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
</script>