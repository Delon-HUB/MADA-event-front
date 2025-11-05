import { secureAPI } from '@/instances/axios'
import socket from '@/instances/socket'
import type { IEvent } from '@/interfaces/IEvent'
import { defineStore } from 'pinia'
import { useUserStore } from './User.store'
import { ERole } from '@/enums/ERole'
import { ref } from 'vue'

export const useEventStore = defineStore('event', () => {
  let events = ref<IEvent[]>([])

  const init = async () => {
    const $userStore = useUserStore()
    await $userStore.init()

    if ($userStore.getCurrentUser().role == ERole.CLIENT) await fetchAll()
    else if ($userStore.getCurrentUser().role == ERole.ORGANIZER) await getMyEvents()

    socket.connect()
    if (socket.connected) console.log(`${socket.id} connected`)

    socket.on('connect_error', () => {
      setTimeout(() => {
        socket.connect()
      }, 30_000)
    })
    socket.on('connect', () => console.log(`${socket.id} connected`))
    socket.on('disconnect', () => console.log(`${socket.id} connected`))

    socket.on('newEvent', (event: IEvent) => {
      if ($userStore.getCurrentUser().role == ERole.CLIENT) events.value.push(event)
      else if ($userStore.getCurrentUser()._id === event.ownerId) events.value.push(event)
    })
  }

  const fetchAll = async () => {
    const response = await secureAPI.post('/event/all')
    events.value = response.data as IEvent[]
  }

  const getMyEvents = async () => {
    const response = await secureAPI.post('/event/mine')
    events.value = response.data as IEvent[]
  }

  const getEvents = () => events

  return { init, getMyEvents, fetchAll, getEvents, events }
})
