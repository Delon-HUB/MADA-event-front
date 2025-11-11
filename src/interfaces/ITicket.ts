import type { IEvent } from './IEvent'
import type { IUser } from './IUser'

export interface ITicket {
  _id?: string
  userId: string | IUser
  eventId: string | IEvent
  nbChild: number
  nbAdult: number
  nbSenior: number
  status?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED'
  createdAt?: Date
  updatedAt?: Date
}
