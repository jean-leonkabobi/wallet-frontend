<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
    <TransitionGroup name="notification">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 text-sm font-medium',
          notificationClasses[notification.type]
        ]"
      >
        <CheckCircle v-if="notification.type === 'success'" class="w-5 h-5 flex-shrink-0" />
        <XCircle v-else-if="notification.type === 'error'" class="w-5 h-5 flex-shrink-0" />
        <AlertTriangle v-else-if="notification.type === 'warning'" class="w-5 h-5 flex-shrink-0" />
        <Info v-else class="w-5 h-5 flex-shrink-0" />
        <span class="flex-1">{{ notification.message }}</span>
        <button @click="removeNotification(notification.id)" class="flex-shrink-0 hover:opacity-70">
          <X class="w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import { useNotification } from '@/composables/useNotification'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from '@lucide/vue'

const { notifications, removeNotification } = useNotification()

const notificationClasses: Record<string, string> = {
  success: 'bg-green-50 text-green-800 border border-green-200',
  error: 'bg-red-50 text-red-800 border border-red-200',
  warning: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
  info: 'bg-blue-50 text-blue-800 border border-blue-200'
}
</script>

<style scoped>
.notification-enter-active {
  transition: all 0.3s ease-out;
}
.notification-leave-active {
  transition: all 0.2s ease-in;
}
.notification-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>