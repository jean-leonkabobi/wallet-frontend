<template>
  <AppLayout>
    <div class="space-y-6">
      <div>
        <h1 class="text-[32px] font-bold text-secondary">Tableau de bord</h1>
        <p class="text-gray-500 mt-1">Vue d'ensemble de vos finances</p>
      </div>

      <!-- Carte solde principal -->
      <div class="balance-card">
        <div class="flex items-center justify-between mb-4">
          <span class="text-white/80 text-sm">Solde total</span>
          <Wallet class="w-8 h-8 text-white/80" />
        </div>
        <p class="text-4xl font-bold mb-2">-- €</p>
        <div class="flex items-center gap-2 text-white/70 text-sm">
          <TrendingUp class="w-4 h-4" />
          <span>+0% ce mois</span>
        </div>
      </div>

      <!-- Grille de statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="stat-card">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <TrendingUp class="w-5 h-5 text-success" />
            </div>
            <span class="text-sm font-medium text-gray-500">Revenus</span>
          </div>
          <p class="text-2xl font-bold text-success">-- €</p>
        </div>

        <div class="stat-card">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center">
              <TrendingDown class="w-5 h-5 text-danger" />
            </div>
            <span class="text-sm font-medium text-gray-500">Dépenses</span>
          </div>
          <p class="text-2xl font-bold text-danger">-- €</p>
        </div>

        <div class="stat-card">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Target class="w-5 h-5 text-primary" />
            </div>
            <span class="text-sm font-medium text-gray-500">Épargne</span>
          </div>
          <p class="text-2xl font-bold text-primary">-- €</p>
        </div>
      </div>

      <!-- Graphiques -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card">
          <h3 class="text-lg font-semibold text-secondary mb-4">Dépenses par catégorie</h3>
          <div class="h-64 flex items-center justify-center text-gray-300">
            <BarChart3 class="w-16 h-16" />
          </div>
        </div>
        <div class="card">
          <h3 class="text-lg font-semibold text-secondary mb-4">Évolution mensuelle</h3>
          <div class="h-64 flex items-center justify-center text-gray-300">
            <Activity class="w-16 h-16" />
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/components/layout/AppLayout.vue'
import { Wallet, TrendingUp, TrendingDown, Target, BarChart3, Activity } from '@lucide/vue'
</script>