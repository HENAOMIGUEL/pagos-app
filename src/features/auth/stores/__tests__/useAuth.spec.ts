import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import type { AuthUser } from '@/features/auth/types/auth'

vi.mock('@/features/auth/services/auth.service', () => ({
  authService: {
    login: vi.fn(),
  },
}))

import { authService } from '@/features/auth/services/auth.service'
import { useAuth } from '@/features/auth/stores/useAuth'

const authUser: AuthUser = {
  id: '1',
  username: 'admin',
  password: 'Admin123',
  name: 'Administrador',
  role: 'admin',
}

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    vi.mocked(authService.login).mockReset()
  })

  it('guarda la sesión sin la contraseña cuando el login es válido', async () => {
    vi.mocked(authService.login).mockResolvedValue(authUser)
    const auth = useAuth()

    await expect(auth.login({ username: 'admin', password: 'Admin123' })).resolves.toBe(true)

    expect(auth.isAuthenticated).toBe(true)
    expect(auth.user).toEqual({
      id: '1',
      username: 'admin',
      name: 'Administrador',
      role: 'admin',
    })
    expect(auth.errorMessage).toBe('')
    expect(JSON.parse(localStorage.getItem('auth-user') ?? '')).not.toHaveProperty('password')
  })

  it('publica el error y no abre sesión cuando el login falla', async () => {
    vi.mocked(authService.login).mockRejectedValue(new Error('Usuario o contraseña incorrectos'))
    const auth = useAuth()

    await expect(auth.login({ username: 'admin', password: 'mala' })).resolves.toBe(false)

    expect(auth.isAuthenticated).toBe(false)
    expect(auth.user).toBeNull()
    expect(auth.errorMessage).toBe('Usuario o contraseña incorrectos')
    expect(localStorage.getItem('auth-user')).toBeNull()
  })

  it('cierra la sesión y borra el usuario guardado', async () => {
    vi.mocked(authService.login).mockResolvedValue(authUser)
    const auth = useAuth()

    await auth.login({ username: 'admin', password: 'Admin123' })
    auth.logout()

    expect(auth.isAuthenticated).toBe(false)
    expect(auth.user).toBeNull()
    expect(localStorage.getItem('auth-user')).toBeNull()
  })

  it('recupera la sesión guardada al iniciar', () => {
    localStorage.setItem(
      'auth-user',
      JSON.stringify({
        id: '1',
        username: 'admin',
        name: 'Administrador',
        role: 'admin',
      }),
    )

    const auth = useAuth()

    expect(auth.isAuthenticated).toBe(true)
    expect(auth.user?.name).toBe('Administrador')
  })
})
