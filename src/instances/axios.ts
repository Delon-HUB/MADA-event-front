import type { EError } from '@/enums/EError'
import router from '@/router'
import { useAuthStore } from '@/stores/Auth.store'
import { errorForFrenchUser } from '@/utils/errorForHumain'
import axios, { AxiosError } from 'axios'
import { Notify } from 'quasar'
import type {
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
  NavigationGuardNext,
} from 'vue-router'

const secureAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
  },
})

const publicAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

router.beforeEach(
  async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalizedLoaded,
    next: NavigationGuardNext,
  ) => {
    const $authStore = await useAuthStore()

    if (to.meta.requireAuth && !$authStore.token.trim()) next('/auth/login')
    else next()
  },
)

router.beforeResolve(
  async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalizedLoaded,
    next: NavigationGuardNext,
  ) => {
    const $authStore = await useAuthStore()
    if (to.meta.requireEmail && !$authStore.email) next(from.path)
    else next()
  },
)

publicAPI.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message = errorForFrenchUser(
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
    const message = errorForFrenchUser(
      (error.response?.data as { statusCode: number; message: EError })?.message || error.code,
    )
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
