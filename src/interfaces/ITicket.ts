import type { IEvent } from './IEvent'

export interface ITicket {
  _id?: string
  userId: string
  eventId: string | IEvent
  price: number
  paymentStatus: 'PENDING' | 'PAID' | 'CANCELLED'
  paymentMethod?: string
  qrCodeUrl?: string
  createdAt?: Date
  updatedAt?: Date
}
