import type { EError } from '@/enums/EError'
import router from '@/router'
import { translateError } from '@/utils/errorForHumain'
import axios, { AxiosError } from 'axios'
import { Notify } from 'quasar'

const token = localStorage.getItem('token') || ''
let secureAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  },
})

secureAPI.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data'
  } else {
    config.headers['Content-Type'] = 'application/json'
  }
  return config
})

const publicAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

publicAPI.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message = translateError(
      (error.response?.data as { statusCode: number; message: EError })?.message || error.code,
    )
    Notify.create({
      message: message,
      position: 'top',
      type: 'error',
      icon: 'warning',
      iconColor: 'red',
      classes: 'bg-white text-black',
    })
    return Promise.reject(error)
  },
)

secureAPI.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message = translateError(
      (error.response?.data as { statusCode: number; message: EError })?.message || error.code,
    )
    if (error.status == 401) router.push('/auth/login')
    Notify.create({
      message: message,
      position: 'top',
      type: 'error',
      color: 'accent',
      icon: 'warning',
      iconColor: 'red',
      classes: 'bg-white text-black',
    })
    return Promise.reject(error)
  },
)

export { publicAPI, secureAPI }
