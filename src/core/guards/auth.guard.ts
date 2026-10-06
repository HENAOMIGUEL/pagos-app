import type { NavigationGuard } from 'vue-router'

export const AUTH_STORAGE_KEY = 'auth-user'

export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_STORAGE_KEY) !== null
}

export const authGuard: NavigationGuard = (to) => {
  if (!to.meta.requiresAuth || isAuthenticated()) {
    return true
  }

  return {
    name: 'login',
    query: { redirect: to.fullPath },
  }
}
