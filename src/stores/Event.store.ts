import socket from '@/instances/socket'
import { defineStore } from 'pinia'

export const useEventStore = defineStore('event', () => {
  const init = () => {
    socket.connect()
    if (socket.connected) console.log(`${socket.id} connected`)

    socket.on('connect_error', () => {
      setTimeout(() => {
        socket.connect()
      }, 30_000)
    })

    socket.on('connect', () => console.log(`${socket.id} connected`))

    socket.on('disconnect', () => console.log(`${socket.id} connected`))
  }

  return { init }
})
