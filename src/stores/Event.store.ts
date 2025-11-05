import { secureAPI } from '@/instances/axios'
import socket from '@/instances/socket'
import type { IEvent } from '@/interfaces/IEvent'
import { defineStore } from 'pinia'

export const useEventStore = defineStore('event', () => {
  let events: IEvent[] = []

  const init = async () => {
    await fetchAll()
    socket.connect()
    if (socket.connected) console.log(`${socket.id} connected`)

    socket.on('connect_error', () => {
      setTimeout(() => {
        socket.connect()
      }, 30_000)
    })
    socket.on('connect', () => console.log(`${socket.id} connected`))
    socket.on('disconnect', () => console.log(`${socket.id} connected`))

    socket.on('newEvent', (event: IEvent) => {
      events.push(event)
    })
  }

  const fetchAll = async () => {
    const response = await secureAPI.post('/event/all')
    events = response.data as IEvent[]
  }

  const getEvents = () => events

  return { init, getEvents, events }
})
