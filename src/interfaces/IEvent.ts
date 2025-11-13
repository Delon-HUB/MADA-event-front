import type { IUser } from './IUser'

export interface IEvent {
  _id?: string
  title: string
  description?: string
  category: string
  location: string
  address: string
  photo?: string
  startDate: Date
  endDate: Date
  price: number
  capacity: number
  ticketsAvailable?: number
  ownerId: string | IUser
  ticketAvailable?: number
  canceled?: boolean
  status?: 'UPCOMING' | 'ONGOING' | 'CANCELED' | 'ENDED'
  createdAt?: Date
  updatedAt?: Date
}
