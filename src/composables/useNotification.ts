import { ref } from 'vue'

export interface Notification {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
}

const notifications = ref<Notification[]>([])
let nextId = 0

export function useNotification() {
  function addNotification(type: Notification['type'], message: string) {
    const id = nextId++
    notifications.value.push({ id, type, message })
    setTimeout(() => {
      removeNotification(id)
    }, 5000)
  }

  function removeNotification(id: number) {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  function success(message: string) {
    addNotification('success', message)
  }

  function error(message: string) {
    addNotification('error', message)
  }

  function warning(message: string) {
    addNotification('warning', message)
  }

  function info(message: string) {
    addNotification('info', message)
  }

  return {
    notifications,
    success,
    error,
    warning,
    info,
    removeNotification
  }
}