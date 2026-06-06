<template>
  <header class="bg-surface border-b border-border sticky top-0 z-40">
    <div class="flex justify-between items-center px-6 lg:px-8 h-16">
      <div class="flex items-center gap-3">
        <div class="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
          <Wallet class="w-5 h-5 text-white" />
        </div>
        <h1 class="text-xl font-bold text-secondary">Wallet</h1>
      </div>

      <div class="flex items-center gap-4" v-if="authStore.user">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <User class="w-4 h-4 text-primary" />
          </div>
          <div class="hidden sm:block">
            <p class="text-sm font-medium text-secondary">{{ authStore.user.firstName }} {{ authStore.user.lastName }}</p>
            <p class="text-xs text-gray-400">{{ authStore.user.email }}</p>
          </div>
        </div>

        <button @click="handleLogout" class="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-danger hover:bg-red-50 rounded-lg transition-colors">
          <LogOut class="w-4 h-4" />
          <span class="hidden sm:inline">Déconnexion</span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { Wallet, User, LogOut } from '@lucide/vue'

const authStore = useAuthStore()
const router = useRouter()

function handleLogout() {
  authStore.logout()
  router.push('/login')
}
</script>