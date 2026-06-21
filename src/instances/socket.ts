import { io } from 'socket.io-client'

const socket = io(import.meta.env.VITE_API_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  auth: {
    token: `Bearer ${localStorage.getItem('token') || ''}`,
  },
  timeout: 30_000,
})

export default socket
