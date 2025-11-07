import { secureAPI } from '@/instances/axios'
import { defineStore } from 'pinia'
import type { ICreatePaymentDto as IPayment } from '@/interfaces/IPayment'
import type { ITicket } from '@/interfaces/ITicket'
import { ref } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isBetween from 'dayjs/plugin/isBetween'

dayjs.extend(relativeTime)
dayjs.extend(isBetween)

export const userTicketStore = defineStore('ticket', () => {
  let tickets = ref<ITicket[]>([])

  const init = async () => {
    await getMyTickets()
  }

  const getMyTickets = async () => {
    const response = await secureAPI.post('/ticket/mine')
    tickets.value = response.data as ITicket[]
  }

  const buy = async (payment: Partial<IPayment>) => {
    const response = await secureAPI.post('/payment', payment)
    return response
  }

  const getTikectsForEvent = async (eventId: string) => {
    const response = await secureAPI.post('/ticket/event', { eventId: eventId })
    return response.data as ITicket[]
  }

  return { init, getMyTickets, getTikectsFoEvent: getTikectsForEvent, buy, tickets }
})
