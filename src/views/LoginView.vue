<template>
  <div class="min-h-screen flex items-center justify-center bg-background p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary mb-6">
          <Wallet class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-[32px] font-bold text-secondary mb-2">Wallet</h1>
        <p class="text-gray-500">Gérez votre argent simplement.</p>
      </div>

      <!-- Formulaire -->
      <div class="card">
        <h2 class="text-2xl font-semibold text-secondary mb-6">Connexion</h2>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label for="email" class="block text-sm font-medium text-secondary mb-2">Email</label>
            <div class="relative">
              <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                id="email"
                v-model="form.email"
                required
                placeholder="votre@email.com"
                class="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-secondary mb-2">Mot de passe</label>
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="form.password"
                required
                placeholder="••••••••"
                class="input-field pl-10 pr-10"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <EyeOff v-if="showPassword" class="w-4 h-4" />
                <Eye v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div v-if="error" class="flex items-center gap-2 bg-red-50 text-danger px-4 py-3 rounded-xl text-sm">
            <AlertCircle class="w-4 h-4 flex-shrink-0" />
            <span>{{ error }}</span>
          </div>

          <button type="submit" :disabled="loading" class="btn-primary w-full flex items-center justify-center gap-2">
            <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
            <span>{{ loading ? 'Connexion...' : 'Se connecter' }}</span>
          </button>
        </form>
      </div>

      <p class="text-center mt-8 text-sm text-gray-500">
        Pas encore de compte ?
        <router-link to="/register" class="text-primary font-medium hover:text-primary-dark">
          Créer un compte
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Wallet, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from '@lucide/vue'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({ email: '', password: '' })
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    await authStore.login(form.value)
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Email ou mot de passe incorrect'
  } finally {
    loading.value = false
  }
}
</script>