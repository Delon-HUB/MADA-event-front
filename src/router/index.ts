import { createRouter, createWebHistory } from 'vue-router'
import { AUTH_ROUTER } from './auth'
import MainLayout from '@/layouts/MainLayout.vue'

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
    {
      path: '/:catchAll(.*)',
      name: 'not-found',
      component: () => import('../pages/NotFound.vue'),
    },
  ],
})

export default router
