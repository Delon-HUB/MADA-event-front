import { secureAPI } from '@/instances/axios'
import { defineStore } from 'pinia'
import type { ICreatePaymentDto as IPayment } from '@/interfaces/IPayment'
import type { ITicket } from '@/interfaces/ITicket'
import { computed, ref, watch } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isBetween from 'dayjs/plugin/isBetween'
import { useUserStore } from './User.store'
import { ERole } from '@/enums/ERole'

dayjs.extend(relativeTime)
dayjs.extend(isBetween)

export const useTicketStore = defineStore('ticket', () => {
  let tickets = ref<ITicket[]>([])
  let totalPrice = ref<number>(0)

  watch(
    () => tickets.value.length,
    () => {
      totalPrice.value = 0
      tickets.value.forEach((t) => (totalPrice.value += t.price))
    },
  )

  const init = async () => {
    const $userStore = useUserStore()
    if ($userStore.currentUser!.role == ERole.CLIENT) await getMyTickets()
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

  return { init, getMyTickets, getTikectsForEvent, buy, tickets, totalPrice }
})
