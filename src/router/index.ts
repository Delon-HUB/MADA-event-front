import { createRouter, createWebHistory } from 'vue-router'
import { AUTH_ROUTER } from './auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
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

export default router
