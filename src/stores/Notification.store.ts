import { secureAPI } from '@/instances/axios'
import type { INotification } from '@/interfaces/INotification'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<INotification[]>([])
  const unread = ref<number>(0)

  const init = async () => {
    await getMyNotifications()
  }

  const clear = () => {
    notifications.value = []
    unread.value = 0
  }

  const getMyNotifications = async () => {
    const response = await secureAPI.post('/notification/mine')
    notifications.value = response.data as INotification[]
    console.log(notifications.value)
  }

  return { notifications, unread, clear, init }
})
