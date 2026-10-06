import type { NavigationGuard } from 'vue-router'

import { useAuth } from '@/features/auth/stores/useAuth'

export const authGuard: NavigationGuard = (to) => {
  const auth = useAuth()

  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'payment-methods' }
  }

  if (!to.meta.requiresAuth || auth.isAuthenticated) {
    return true
  }

  return { name: 'login' }
}
