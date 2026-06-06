export function useFormat() {
  function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  function formatDateShort(dateString: string): string {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  function formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`
  }

  function getMonthName(month: number): string {
    const months: string[] = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ]
    return months[month - 1] || 'Inconnu'
  }

  return {
    formatCurrency,
    formatDate,
    formatDateShort,
    formatPercentage,
    getMonthName
  }
}