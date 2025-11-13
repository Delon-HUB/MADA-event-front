import { secureAPI } from '@/instances/axios'
import type { IEvent } from '@/interfaces/IEvent'
import { defineStore } from 'pinia'
import { computed, reactive, ref, watch } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isBetween from 'dayjs/plugin/isBetween'
import 'dayjs/locale/fr'
import { EventStatus } from '@/enums/EStatus'

dayjs.extend(relativeTime)
dayjs.extend(isBetween)

export const useEventStore = defineStore('event', () => {
  let all = ref<IEvent[]>([])
  let upcoming = computed(() => all.value.filter((event) => event.status == EventStatus.UPCOMING))
  let ongoing = computed(() => all.value.filter((event) => event.status == EventStatus.ONGOING))
  let canceled = computed(() => all.value.filter((event) => event.status == EventStatus.CANCELLED))
  let terminated = computed(() => all.value.filter((event) => event.status == EventStatus.ENDED))

  const init = async () => {
    await getEvents()
  }

  const getEvents = async () => {
    const response = await secureAPI.get('/event')
    all.value = response.data as IEvent[]
  }

  const getMyEvents = async () => {
    const response = await secureAPI.post('/event/mine')
    return response.data as IEvent[]
  }

  const findById = async (eventId: string) => {
    const response = await secureAPI.get(`/event/${eventId}`)
    const event = response.data as IEvent
    return event
  }

  const cancelEvent = async (eventId: string) => {
    const response = await secureAPI.patch(`/event/${eventId}`)
    const event = response.data
    return event
  }

  return {
    init,
    getMyEvents,
    getEvents,
    findById,
    cancelEvent,
    all,
    ongoing,
    upcoming,
    canceled,
    terminated,
  }
})
