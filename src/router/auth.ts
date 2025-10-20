export const AUTH_ROUTER = [
  {
    path: 'login',
    name: 'login',
    component: () => import('@/pages/Login.vue'),
  },
  {
    path: 'register',
    name: 'register',
    component: () => import('@/pages/Register.vue'),
  },
]
