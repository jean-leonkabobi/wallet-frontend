<template>
  <aside class="w-64 bg-secondary hidden lg:block">
    <nav class="flex flex-col gap-1 p-4">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
        active-class="bg-primary text-white font-medium"
      >
        <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
        <span class="text-sm">{{ item.label }}</span>
      </router-link>
    </nav>

    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
      <p class="text-xs text-gray-500 text-center">Wallet v1.0</p>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { LayoutDashboard, TrendingUp, TrendingDown, Target, Search } from '@lucide/vue'

const menuItems = [
  { path: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { path: '/revenues', label: 'Revenus', icon: TrendingUp },
  { path: '/expenses', label: 'Dépenses', icon: TrendingDown },
  { path: '/budgets', label: 'Budgets', icon: Target },
  { path: '/search', label: 'Recherche', icon: Search }
]
</script>