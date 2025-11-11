import type { ITicket } from './ITicket'

export interface IPayment {
  _id?: string
  ticketId: string | ITicket
  amount: number
  method: string
  phoneNumber: string
  qrCodeUrl?: string
  status?: string
  createdAt?: Date
  updatedAt?: Date
}
