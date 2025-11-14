import { secureAPI } from '@/instances/axios'
import { defineStore } from 'pinia'
import type { IPayment as IPayment } from '@/interfaces/IPayment'
import type { ITicket } from '@/interfaces/ITicket'
import { computed, ref } from 'vue'
import { useUserStore } from './User.store'
import { ERole } from '@/enums/ERole'
import socket from '@/instances/socket'
import { useEventStore } from './Event.store'
import { PaymentStatus } from '@/enums/EStatus'

export const useTicketStore = defineStore('ticket', () => {
  let tickets = ref<ITicket[]>([])
  let payments = ref<IPayment[]>([])

  let paymentRefunded = computed<IPayment[]>(() =>
    payments.value.filter((p) => p.status == PaymentStatus.REFUNDED),
  )
  let paymentNotRefunded = computed<IPayment[]>(() =>
    payments.value.filter((p) => p.status == PaymentStatus.PAID),
  )

  let totalRefundedAmount = computed<number>(() => {
    let total = 0
    paymentRefunded.value.forEach((p) => (total += p.refundedAmount!))
    return total
  })

  let gain = computed<number>(() => {
    let total = 0
    payments.value.forEach((p) => (total += p.amount))
    return total - totalRefundedAmount.value
  })

  const $userStore = useUserStore()
  const $eventStore = useEventStore()

  const init = async () => {
    if (!socket.connected) socket.connect()
    if ($userStore.currentUser!.role == ERole.CLIENT) {
      payments.value = await getPaymentsByUserId($userStore.currentUser!._id!)
      payments.value.reverse()
    } else if ($userStore.currentUser!.role == ERole.ORGANIZER) {
      await Promise.all(
        $eventStore.all.map(async (event) => {
          const ticks = await getTikectsForEvent(event._id!)
          if (ticks.length > 0) tickets.value = tickets.value.concat(ticks)
        }),
      )

      await Promise.all(
        tickets.value.map(async (t) => {
          const p = await getPaymentsByTicketId(t._id!)
          if (p.length > 0) payments.value = payments.value.concat(p)
        }),
      )
      tickets.value = tickets.value.reverse()
    }
  }

  const getMyTickets = async () => {
    const response = await secureAPI.post('/ticket/mine')
    tickets.value = response.data as ITicket[]
  }

  const getPaymentsByUserId = async (userId: string) => {
    const response = await secureAPI.get(`/payment/user/${userId}`)
    return response.data as IPayment[]
  }

  const getPaymentsByTicketId = async (ticketId: string) => {
    const response = await secureAPI.get(`/payment/ticket/${ticketId}`)
    return response.data as IPayment[]
  }

  const getRefundAmount = async (paymentId: string) => {
    const response = await secureAPI.get(`/payment/refund/${paymentId}`)
    return response.data as { paymentId: string; allowedAmount: number }
  }

  const acceptRefund = async (paymentId: string) => {
    const response = await secureAPI.post(`/payment/refund/accept`, { paymentId: paymentId })
    return response.data as IPayment
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

  return {
    init,
    getMyTickets,
    getTikectsForEvent,
    createTicket,
    getRefundAmount,
    acceptRefund,
    paymentNotRefunded,
    paymentRefunded,
    payments,
    tickets,
    gain,
    totalRefundedAmount,
  }
})
