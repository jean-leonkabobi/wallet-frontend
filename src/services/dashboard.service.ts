import api from './api'
import type { DashboardData } from '@/types'

class DashboardService {
  async getDashboard(month?: number, year?: number): Promise<DashboardData> {
    const response = await api.get<DashboardData>('/dashboard', {
      params: { month, year }
    })
    return response.data
  }
}

export default new DashboardService()