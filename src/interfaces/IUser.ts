import type { ERole } from '@/enums/ERole'

export interface IUser {
  _id?: string
  firstName: string
  lastName?: string
  email: string
  password: string
  otp?: string
  otpExpiry?: Date
  role: ERole
  createdAt: Date
  updatedAt: Date
}
