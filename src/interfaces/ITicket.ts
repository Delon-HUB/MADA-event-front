import type { IEvent } from './IEvent'
import type { IUser } from './IUser'

export interface ITicket {
  _id?: string
  userId: string | IUser
  eventId: string | IEvent
  price: number
  paymentStatus: 'PENDING' | 'PAID' | 'CANCELLED'
  paymentMethod?: string
  qrCodeUrl?: string
  createdAt?: Date
  updatedAt?: Date
}
