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

    socket.on('newNotification', (notification: INotification) => {
      notifications.value.unshift(notification)
      unread.value++
    })

    socket.on('newEvent', (event: IEvent) => {
      $eventStore.all.push(event)
      $eventStore.repartition(event)
    })

    socket.on('ticketPaid', (payment: IPayment) => {
      if ($userStore.currentUser?.role == ERole.ORGANIZER) {
        Notify.create({
          message: 'Nouveau participant',
          position: 'top-right',
          icon: 'information',
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
          icon: 'checked',
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
