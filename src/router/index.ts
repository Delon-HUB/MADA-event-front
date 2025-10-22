import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
  type RouteLocationNormalizedLoaded,
} from 'vue-router'
import { AUTH_ROUTER } from './auth'
import MainLayout from '@/layouts/MainLayout.vue'
import { useAuthStore } from '@/stores/Auth.store'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: MainLayout,
      meta: { requireAuth: true },
      children: [],
    },
    {
      path: '/auth',
      component: () => import('@/layouts/AuthLayout.vue'),
      redirect: '/auth/login',
      children: [...AUTH_ROUTER],
    },
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: () => import('../pages/NotFound.vue'),
    },
  ],
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

export default router
