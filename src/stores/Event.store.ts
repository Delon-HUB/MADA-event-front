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
import type { ICreatePaymentDto as IPayment } from '@/interfaces/IPayment'
import { useTicketStore } from './Ticket.store'
import type { IUser } from '@/interfaces/IUser'
import { Notify } from 'quasar'
import type { ITicket } from '@/interfaces/ITicket'

dayjs.extend(relativeTime)
dayjs.extend(isBetween)
dayjs.locale('fr')

export const useEventStore = defineStore('event', () => {
  let all = ref<IEvent[]>([])
  let coming = ref<IEvent[]>([])
  let inProgress = ref<IEvent[]>([])
  let terminated = ref<IEvent[]>([])

  const $ticketStore = useTicketStore()
  const $userStore = useUserStore()

  const init = async () => {
    await $userStore.init()
    if (!socket.connected) socket.connect()

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

    socket.on('newEvent', (event: IEvent) => {
      all.value.push(event)
      repartition(event)
    })

    socket.on('ticketPaid', (newTicket: ITicket) => {
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
        $userStore.currentUser?._id == newTicket.userId
      ) {
        Notify.create({
          message: 'Achat de billet effectué',
          position: 'top-right',
          icon: 'checked',
          iconColor: 'green',
          classes: 'bg-white text-black',
        })
      }
      const event = all.value.find((ev) => ev._id == (newTicket.eventId as IEvent)._id)
      if (event) event.participants.push(newTicket.userId as IUser)
      $ticketStore.tickets.push(newTicket)
    })

    socket.on('connect_error', () => {
      setTimeout(() => {
        socket.connect()
      }, 30_000)
    })
    socket.on('connect', () => console.log(`${socket.id} connected`))
    socket.on('disconnect', () => console.log(`${socket.id} disconnected`))
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
          $ticketStore.totalPrice += t.price
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

  const buy = async (payment: Partial<IPayment>) => {
    const response = await secureAPI.post('/payment', payment)
    return response
  }

  const getEvents = () => all

  return {
    init,
    getMyEvents,
    fetchAll,
    getEvents,
    buy,
    all,
    inProgress,
    coming,
    terminated,
  }
})
