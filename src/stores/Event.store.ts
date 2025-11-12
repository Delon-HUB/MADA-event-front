import { secureAPI } from '@/instances/axios'
import type { IEvent } from '@/interfaces/IEvent'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isBetween from 'dayjs/plugin/isBetween'
import 'dayjs/locale/fr'
import { useTicketStore } from './Ticket.store'

dayjs.extend(relativeTime)
dayjs.extend(isBetween)

export const useEventStore = defineStore('event', () => {
  let all = ref<IEvent[]>([])
  let upcoming = ref<IEvent[]>([])
  let ongoing = ref<IEvent[]>([])
  let terminated = ref<IEvent[]>([])

  const init = async () => {
    upcoming.value = []
    ongoing.value = []
    terminated.value = []
    await getEvents()
    all.value.forEach((ev) => repartition(ev))
  }

  const getEvents = async () => {
    const response = await secureAPI.get('/event')
    all.value = response.data as IEvent[]
  }

  const getMyEvents = async () => {
    const response = await secureAPI.post('/event/mine')
    return response.data as IEvent[]
  }

  const repartition = (event: IEvent) => {
    if (event.status == 'UPCOMING') upcoming.value.push(event)
    else if (event.status == 'ONGOING') ongoing.value.push(event)
    else terminated.value.push(event)
  }

  const findById = async (eventId: string) => {
    const response = await secureAPI.get(`/event/${eventId}`)
    const event = response.data as IEvent
    return event
  }

  return {
    init,
    getMyEvents,
    getEvents,
    findById,
    repartition,
    all,
    ongoing,
    upcoming,
    terminated,
  }
})
