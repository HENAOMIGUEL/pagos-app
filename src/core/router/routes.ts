import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { authGuard } from '@/core/guards/auth.guard'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: { name: 'payment-methods' },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/features/auth/views/LoginView.vue'),
  },
  {
    path: '/metodos-de-pago',
    name: 'payment-methods',
    component: () => import('@/features/payment-methods/views/PaymentMethodsView.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(authGuard)

export default router
