import type { EventStatus } from '@/enums/EStatus'
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
  cancelled?: boolean
  status?: EventStatus
  createdAt?: Date
  updatedAt?: Date
}
