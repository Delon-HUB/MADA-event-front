import Home from '@/pages/client/Home.vue'
import Dashboard from '@/pages/organizer/Dashboard.vue'

export const HOME_ROUTER = [
  {
    path: 'client',
    name: 'client',
    redirect: '/client/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: Home,
      },
      {
        path: 'tickets',
        name: 'tickets',
        component: () => import('@/pages/client/Ticket.vue'),
      },
    ],
  },
  {
    path: 'organizer',
    name: 'organizer',
    redirect: '/organizer/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: Dashboard,
      },
      {
        path: 'event',
        name: 'event',
        component: () => import('@/pages/organizer/Event.vue'),
      },
    ],
  },
]
