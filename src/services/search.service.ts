import api from './api'
import type { Transaction, TransactionSearch } from '@/types'

class SearchService {
  async searchTransactions(searchDTO: TransactionSearch): Promise<Transaction[]> {
    const response = await api.post<Transaction[]>('/search/transactions', searchDTO)
    return response.data
  }
}

export default new SearchService()