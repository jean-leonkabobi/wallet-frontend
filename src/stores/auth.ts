import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginRequest, RegisterRequest } from '@/types'
import AuthService from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value)

  function setAuth(authData: { user: User; token: string }) {
    user.value = authData.user
    token.value = authData.token
    localStorage.setItem('token', authData.token)
  }

  async function login(data: LoginRequest) {
    const response = await AuthService.login(data)
    setAuth({
      user: {
        id: response.id,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        role: response.role
      },
      token: response.token
    })
  }

  async function register(data: RegisterRequest) {
    const response = await AuthService.register(data)
    setAuth({
      user: {
        id: response.id,
        firstName: response.firstName,
        lastName: response.lastName,
        email: response.email,
        role: response.role
      },
      token: response.token
    })
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout
  }
})