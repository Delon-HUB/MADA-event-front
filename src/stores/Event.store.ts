import { secureAPI } from '@/instances/axios'
import socket from '@/instances/socket'
import type { IEvent } from '@/interfaces/IEvent'
import { defineStore } from 'pinia'
import { useUserStore } from './User.store'
import { ERole } from '@/enums/ERole'
import { ref, watch } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isBetween from 'dayjs/plugin/isBetween'
import 'dayjs/locale/fr'

dayjs.extend(relativeTime)
dayjs.extend(isBetween)
dayjs.locale('fr')

export const useEventStore = defineStore('event', () => {
  let all = ref<IEvent[]>([])
  let coming = ref<IEvent[]>([])
  let inProgress = ref<IEvent[]>([])
  let terminated = ref<IEvent[]>([])

  const init = async () => {
    const $userStore = useUserStore()
    await $userStore.init()

    if ($userStore.getCurrentUser().role == ERole.CLIENT) await fetchAll()
    else if ($userStore.getCurrentUser().role == ERole.ORGANIZER) await getMyEvents()
    all.value.forEach((event) => repartition(event))

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
      const isClientOrOwner =
        $userStore.getCurrentUser().role == ERole.CLIENT ||
        $userStore.getCurrentUser()._id === event.ownerId
      if (isClientOrOwner) {
        all.value.push(event)
        repartition(event)
      }
    })
  }

  const fetchAll = async () => {
    const response = await secureAPI.post('/event/all')
    all.value = response.data as IEvent[]
  }

  const getMyEvents = async () => {
    const response = await secureAPI.post('/event/mine')
    all.value = response.data as IEvent[]
  }

  const repartition = (event: IEvent) => {
    const currentDate = dayjs()
    if (currentDate.isBetween(dayjs(event.startDate), dayjs(event.endDate)))
      inProgress.value.push(event)
    else if (currentDate.isBefore(dayjs(event.startDate))) coming.value.push(event)
    else if (currentDate.isAfter(dayjs(event.startDate))) terminated.value.push(event)
  }

  const getEvents = () => all

  return { init, getMyEvents, fetchAll, getEvents, all, inProgress, coming, terminated }
})
