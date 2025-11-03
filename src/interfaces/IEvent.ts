import type { IUser } from './IUser'

export interface ICreateEventDto {
  _id?: string
  title: string
  description?: string
  category: string
  location: string
  photo?: string
  startDate: Date
  endDate: Date
  price: number
  capacity?: number
  ticketsAvailable: number
  participants: IUser[]
  owner: IUser
  createdAt?: Date
  updatedAt?: Date
}
