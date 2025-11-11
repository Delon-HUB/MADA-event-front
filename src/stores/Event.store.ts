import { secureAPI } from '@/instances/axios'
import socket from '@/instances/socket'
import type { IEvent } from '@/interfaces/IEvent'
import { defineStore } from 'pinia'
import { useUserStore } from './User.store'
import { ERole } from '@/enums/ERole'
import { ref } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isBetween from 'dayjs/plugin/isBetween'
import 'dayjs/locale/fr'
import { useTicketStore } from './Ticket.store'
import type { IUser } from '@/interfaces/IUser'

dayjs.extend(relativeTime)
dayjs.extend(isBetween)

export const useEventStore = defineStore('event', () => {
  let all = ref<IEvent[]>([])
  let coming = ref<IEvent[]>([])
  let inProgress = ref<IEvent[]>([])
  let terminated = ref<IEvent[]>([])

  const $userStore = useUserStore()

  const init = async () => {
    if ($userStore.currentUser!.role == ERole.CLIENT) {
      await fetchAll()
    } else if ($userStore.currentUser!.role == ERole.ORGANIZER) {
      all.value = await getMyEvents()
      await fetchParticipants()
    }
    coming.value = []
    inProgress.value = []
    terminated.value = []
    all.value.forEach((ev) => repartition(ev))
  }

  const fetchAll = async () => {
    const response = await secureAPI.post('/event/all')
    all.value = response.data as IEvent[]
  }

  const getMyEvents = async () => {
    const response = await secureAPI.post('/event/mine')
    return response.data as IEvent[]
  }

  const fetchParticipants = async (): Promise<IEvent[]> => {
    const $ticketStore = useTicketStore()
    const res = await Promise.all(
      all.value.map(async (ev) => {
        const tickets = await $ticketStore.getTikectsForEvent(ev._id!)
        tickets.forEach((t) => {
          $ticketStore.tickets.push(t)
          // $ticketStore.totalPrice += t.price
        })
        ev.participants = tickets.map((t) => t.userId as IUser)
        return ev
      }),
    )
    return res
  }

  const repartition = (event: IEvent) => {
    const now = dayjs()
    const startDate = dayjs(event.startDate)
    const endDate = dayjs(event.endDate)

    if (now.isBefore(startDate)) {
      if (!coming.value.includes(event)) coming.value.push(event)
    } else if (now.isAfter(endDate)) {
      if (!terminated.value.includes(event)) terminated.value.push(event)
    } else if (now.isBetween(startDate, endDate, null, '[]')) {
      if (!inProgress.value.includes(event)) inProgress.value.push(event)
    }
  }

  const findById = async (eventId: string) => {
    const response = await secureAPI.get(`/event/${eventId}`)
    const event = response.data as IEvent
    return event
  }

  const getEvents = () => all

  return {
    init,
    getMyEvents,
    fetchAll,
    getEvents,
    findById,
    repartition,
    all,
    inProgress,
    coming,
    terminated,
  }
})
