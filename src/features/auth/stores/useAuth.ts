import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import { authService } from '@/features/auth/services/auth.service'
import type { AuthUser, LoginCredentials } from '@/features/auth/types/auth'

type SessionUser = Omit<AuthUser, 'password'>

export const useAuth = defineStore('auth', () => {
  
  const user = ref<SessionUser | null>(readStoredUser())
  const isAuthenticated = computed(() => user.value !== null)
  const errorMessage = ref('')

  async function login(credentials: LoginCredentials) {
    errorMessage.value = ''

    try {
      const authUser = await authService.login(credentials)
      const { password, ...sessionUser } = authUser

      user.value = sessionUser
      localStorage.setItem('auth-user', JSON.stringify(sessionUser))
      return true
    } catch (error) {
      errorMessage.value = error instanceof Error ? error.message : 'No se pudo iniciar sesión'
      return false
    }
  }

  function logout() {
    user.value = null
    localStorage.removeItem('auth-user')
  }

  return { user, isAuthenticated, errorMessage, login, logout }
})

function readStoredUser(): SessionUser | null {
  try {
    const raw = localStorage.getItem('auth-user')
    return raw ? (JSON.parse(raw) as SessionUser) : null
  } catch {
    localStorage.removeItem('auth-user')
    return null
  }
}
