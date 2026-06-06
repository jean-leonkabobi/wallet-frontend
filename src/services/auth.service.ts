import api from './api'
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types'

class AuthService {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/signin', data)
    return response.data
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/signup', data)
    return response.data
  }
}

export default new AuthService()