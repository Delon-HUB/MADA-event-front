import type { ITicket } from './ITicket'
import type { IUser } from './IUser'

export interface IPayment {
  _id?: string
  ticketId: string | ITicket
  userId: string | IUser
  amount: number
  method: string
  phoneNumber: string
  qrCodeUrl?: string
  status?: string
  createdAt?: Date
  updatedAt?: Date
}
