import { publicAPI } from '@/instances/axios'
import type { IUser } from '@/interfaces/IUser'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  let email = ref<string>(localStorage.getItem('email') || '')
  let token = ref<string>(localStorage.getItem('token') || '')

  const register = async (newUser: Partial<IUser>) => {
    return await publicAPI.post('/auth/register', newUser)
  }

  const login = async (userCredential: Partial<IUser>) => {
    return await publicAPI.post('/auth/login', userCredential)
  }

  const setToken = (_token: string) => {
    localStorage.setItem('token', _token)
    token.value = _token
  }

  const verifyOTP = async (email: string, otp: string) => {
    return await publicAPI.post('/auth/verify-otp', { email, otp })
  }

  const resendOTP = async (email: string) => {
    return await publicAPI.post('/auth/send-otp', { email })
  }

  const setEmail = (_email: string) => {
    localStorage.setItem('email', _email)
    email.value = _email
  }

  return {
    email,
    token,
    setEmail,
    setToken,
    login,
    register,
    verifyOTP,
    resendOTP,
  }
})
