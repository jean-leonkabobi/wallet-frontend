<template>
  <div class="card">
    <h3 class="text-lg font-semibold text-secondary mb-4">Évolution mensuelle</h3>
    <div v-if="!hasData" class="h-64 flex items-center justify-center text-gray-400">
      <div class="text-center">
        <Activity class="w-12 h-12 mx-auto mb-2" />
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
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import type { MonthlyEvolution } from '@/types'
import { Activity } from '@lucide/vue'

Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const props = defineProps<{
  data: MonthlyEvolution[]
}>()

const chartRef = ref<HTMLCanvasElement | null>(null)
let chartInstance: Chart | null = null

const hasData = computed(() => props.data.length > 0)

function createChart() {
  if (!chartRef.value || !hasData.value) return

  if (chartInstance) {
    chartInstance.destroy()
  }

  chartInstance = new Chart(chartRef.value, {
    type: 'bar',
    data: {
      labels: props.data.map(d => d.monthName.substring(0, 3)),
      datasets: [
        {
          label: 'Revenus',
          data: props.data.map(d => d.totalRevenues),
          backgroundColor: '#22C55E',
          borderRadius: 6,
          borderSkipped: false
        },
        {
          label: 'Dépenses',
          data: props.data.map(d => d.totalExpenses),
          backgroundColor: '#EF4444',
          borderRadius: 6,
          borderSkipped: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true,
            pointStyleWidth: 10,
            font: {
              size: 12,
              family: 'Inter'
            }
          }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.parsed.y as number
              return ` ${value.toFixed(2)} €`
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => `${value} €`
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