import api from './api'
import type { ExportRequest } from '@/types'

class ExportService {
  async exportCSV(request: ExportRequest): Promise<Blob> {
    const response = await api.post('/export/csv', request, {
      responseType: 'blob'
    })
    return response.data
  }

  async exportPDF(request: ExportRequest): Promise<Blob> {
    const response = await api.post('/export/pdf', request, {
      responseType: 'blob'
    })
    return response.data
  }

  downloadBlob(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }
}

export default new ExportService()