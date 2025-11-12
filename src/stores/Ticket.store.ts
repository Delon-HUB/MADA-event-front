import { secureAPI } from '@/instances/axios'
import { defineStore } from 'pinia'
import type { IPayment as IPayment } from '@/interfaces/IPayment'
import type { ITicket } from '@/interfaces/ITicket'
import { ref } from 'vue'
import { useUserStore } from './User.store'
import { ERole } from '@/enums/ERole'
import socket from '@/instances/socket'
import { useEventStore } from './Event.store'

export const useTicketStore = defineStore('ticket', () => {
  let tickets = ref<ITicket[]>([])
  let payments = ref<IPayment[]>([])

  let totalPrice = ref<number>(0)
  const $userStore = useUserStore()
  const $eventStore = useEventStore()

  const init = async () => {
    if (!socket.connected) socket.connect()
    if ($userStore.currentUser!.role == ERole.CLIENT) {
      await getMyPayments()
    } else if ($userStore.currentUser!.role == ERole.ORGANIZER) {
      await Promise.all(
        $eventStore.all.map(async (event) => {
          const tiks = await getTikectsForEvent(event._id!)
          if (tiks.length > 0) tickets.value = tickets.value.concat(tiks)
        }),
      )
      // chaque ticket => getPayment => calcul total gain
    }
  }

  const getMyTickets = async () => {
    const response = await secureAPI.post('/ticket/mine')
    tickets.value = response.data as ITicket[]
  }

  const getMyPayments = async () => {
    const response = await secureAPI.get(`/payment/${$userStore.currentUser?._id}`)
    payments.value = response.data as IPayment[]
    payments.value.reverse()
  }

  const createTicket = async (ticket: Partial<ITicket>, paymentMethode: string, phone: string) => {
    const ticketCreated = (await secureAPI.post('/ticket', ticket)).data as ITicket
    const paymentData: Partial<IPayment> = {
      ticketId: ticketCreated._id!,
      method: paymentMethode,
      phoneNumber: phone,
    }
    const payment = (await secureAPI.post('/payment', paymentData)).data as IPayment
  }

  const getTikectsForEvent = async (eventId: string) => {
    const response = await secureAPI.get(`/ticket/event/${eventId}`)
    return response.data as ITicket[]
  }

  return { init, getMyTickets, getTikectsForEvent, createTicket, payments, tickets, totalPrice }
})
