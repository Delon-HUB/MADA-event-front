import router from '@/router'
import { useAuthStore } from '@/stores/Auth.store'
import axios from 'axios'
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

export { publicAPI, secureAPI }
