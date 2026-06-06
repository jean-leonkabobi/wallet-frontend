import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Transaction, TransactionSearch } from '@/types'
import SearchService from '@/services/search.service'
import ExportService from '@/services/export.service'
import type { ExportRequest } from '@/types'

export const useSearchStore = defineStore('search', () => {
  const transactions = ref<Transaction[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function search(searchDTO: TransactionSearch) {
    loading.value = true
    error.value = null
    try {
      transactions.value = await SearchService.searchTransactions(searchDTO)
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erreur lors de la recherche'
    } finally {
      loading.value = false
    }
  }

  async function exportData(request: ExportRequest) {
    loading.value = true
    error.value = null
    try {
      let blob: Blob
      let filename: string

      if (request.format === 'PDF') {
        blob = await ExportService.exportPDF(request)
        filename = `transactions_${request.startDate}_${request.endDate}.pdf`
      } else {
        blob = await ExportService.exportCSV(request)
        filename = `transactions_${request.startDate}_${request.endDate}.csv`
      }

      ExportService.downloadBlob(blob, filename)
    } catch (err: any) {
      error.value = err.response?.data?.message || "Erreur lors de l'export"
    } finally {
      loading.value = false
    }
  }

  return {
    transactions,
    loading,
    error,
    search,
    exportData
  }
})