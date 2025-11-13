import { secureAPI } from '@/instances/axios'
import socket from '@/instances/socket'
import type { IEvent } from '@/interfaces/IEvent'
import type { INotification } from '@/interfaces/INotification'
import type { ITicket } from '@/interfaces/ITicket'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useEventStore } from './Event.store'
import { useUserStore } from './User.store'
import { ERole } from '@/enums/ERole'
import { Notify } from 'quasar'
import { useTicketStore } from './Ticket.store'
import type { IPayment } from '@/interfaces/IPayment'

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<INotification[]>([])
  const unread = ref<number>(0)

  const $userStore = useUserStore()
  const $eventStore = useEventStore()
  const $ticketStore = useTicketStore()

  const init = async () => {
    await getMyNotifications()
    if (!socket.connected) socket.connect()

    socket.on('notification-created', (notification: INotification) => {
      notifications.value.unshift(notification)
      unread.value++
    })

    socket.on('event-created', (event: IEvent) => {
      $eventStore.all.push(event)
    })

    socket.on('ticket-paid', (payment: IPayment) => {
      if ($userStore.currentUser?.role == ERole.ORGANIZER) {
        Notify.create({
          message: 'Nouveau participant',
          position: 'top-right',
          icon: 'payments',
          iconColor: 'green',
          classes: 'bg-white text-black',
        })
      } else if (
        $userStore.currentUser?.role == ERole.CLIENT &&
        $userStore.currentUser?._id == payment.userId
      ) {
        Notify.create({
          message: 'Achat de billet effectué',
          position: 'top-right',
          icon: 'payments',
          iconColor: 'green',
          classes: 'bg-white text-black',
        })
      }
      $ticketStore.payments.unshift(payment)
      $ticketStore.tickets.unshift(payment.ticketId as ITicket)
      const index = $eventStore.all.findIndex(
        (ev) => ev._id == ((payment.ticketId as ITicket).eventId as IEvent)._id,
      )
      $eventStore.all[index] = (payment.ticketId as ITicket).eventId as IEvent
    })

    socket.on('event-cancelled', (event: IEvent) => {
      const events = $eventStore.all
      $eventStore.all = []
      $eventStore.all = events.filter((e) => e._id !== event._id)

      if ($userStore.currentUser?.role == ERole.ORGANIZER) {
        Notify.create({
          message: 'Événement annulé',
          position: 'top-right',
          icon: 'event',
          iconColor: 'red',
          classes: 'bg-white text-black',
        })
        $eventStore.all.push(event)
      }
    })

    socket.on('payment-refunded', (payment: IPayment) => {
      const payments = $ticketStore.payments
      $ticketStore.payments = []
      $ticketStore.payments = [...payments.filter((p) => p._id !== payment._id), payment]
    })

    socket.on('event-updated', (event: IEvent) => {
      const events = $eventStore.all
      $eventStore.all = []
      $eventStore.all = [...events.filter((e) => e._id !== event._id), event]
    })

    socket.on('connect_error', () => {
      setTimeout(() => {
        socket.connect()
      }, 30_000)
    })
    socket.on('connect', () => console.log(`${socket.id} connected`))
    socket.on('disconnect', () => console.log(`${socket.id} disconnected`))
  }

  const clear = () => {
    notifications.value = []
    unread.value = 0
  }

  const getMyNotifications = async () => {
    const response = await secureAPI.post('/notification/mine')
    notifications.value = response.data as INotification[]
  }

  return { notifications, unread, clear, init }
})
