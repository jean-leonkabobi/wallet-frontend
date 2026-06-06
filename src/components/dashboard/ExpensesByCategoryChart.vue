<template>
  <div class="card">
    <h3 class="text-lg font-semibold text-secondary mb-4">Dépenses par catégorie</h3>
    <div v-if="!hasData" class="h-64 flex items-center justify-center text-gray-400">
      <div class="text-center">
        <PieChart class="w-12 h-12 mx-auto mb-2" />
        <p class="text-sm">Aucune donnée pour le moment</p>
      </div>
    </div>
    <div v-else class="h-64">
      <canvas ref="chartRef"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Chart, DoughnutController, ArcElement, Tooltip, Legend } from 'chart.js'
import type { CategoryExpense } from '@/types'
import { PieChart } from '@lucide/vue'

Chart.register(DoughnutController, ArcElement, Tooltip, Legend)

const props = defineProps<{
  data: CategoryExpense[]
}>()

const chartRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const hasData = computed(() => props.data.length > 0)

const categoryColors: Record<string, string> = {
  'Nourriture': '#22C55E',
  'Transport': '#3B82F6',
  'Logement': '#F59E0B',
  'Santé': '#EF4444',
  'Loisirs': '#8B5CF6',
  'Autres': '#6B7280'
}

function getColors(categories: CategoryExpense[]): string[] {
  return categories.map(c => categoryColors[c.categoryName] || '#6B7280')
}

function createChart() {
  if (!chartRef.value || !hasData.value) return

  if (chartInstance) {
    chartInstance.destroy()
  }

  const backgroundColors = getColors(props.data)

  chartInstance = new Chart(chartRef.value, {
    type: 'doughnut',
    data: {
      labels: props.data.map(d => d.categoryName),
      datasets: [{
        data: props.data.map(d => d.totalAmount),
        backgroundColor: backgroundColors,
        borderColor: '#FFFFFF',
        borderWidth: 2,
        hoverBorderWidth: 3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            padding: 16,
            usePointStyle: true,
            pointStyleWidth: 10,
            font: {
              size: 12,
              family: 'Inter'
            },
            generateLabels: (chart) => {
              const dataset = chart.data.datasets[0]
              const bgColors = dataset?.backgroundColor as string[] || []
              return (chart.data.labels || []).map((label, i) => ({
                text: `${label} (${props.data[i]?.percentage.toFixed(0)}%)`,
                fillStyle: bgColors[i] || '#6B7280',
                strokeStyle: bgColors[i] || '#6B7280',
                lineWidth: 0,
                hidden: false,
                index: i,
                pointStyle: 'circle' as const
              }))
            }
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.parsed as number
              return ` ${value.toFixed(2)} €`
            }
          }
        }
      }
    }
  })
}

watch(() => props.data, () => {
  setTimeout(createChart, 100)
}, { deep: true })

onMounted(() => {
  setTimeout(createChart, 100)
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy()
  }
})
</script>