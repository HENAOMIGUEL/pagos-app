import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AxiosError } from 'axios'

import type { AuthUser } from '@/features/auth/types/auth'

vi.mock('@/core/http/api', () => ({
  api: {
    get: vi.fn(),
  },
}))

import { api } from '@/core/http/api'
import { authService } from '@/features/auth/services/auth.service'

const admin: AuthUser = {
  id: '1',
  username: 'admin',
  password: 'Admin123',
  name: 'Administrador',
  role: 'admin',
}

describe('authService.login', () => {
  beforeEach(() => {
    vi.mocked(api.get).mockReset()
  })

  it('devuelve el usuario cuando el usuario y la contraseña coinciden', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [admin] })

    await expect(
      authService.login({ username: ' admin ', password: 'Admin123' }),
    ).resolves.toEqual(admin)

    expect(api.get).toHaveBeenCalledWith('/users', { params: { username: 'admin' } })
  })

  it('rechaza el acceso cuando la contraseña no coincide', async () => {
    vi.mocked(api.get).mockResolvedValue({ data: [admin] })

    await expect(authService.login({ username: 'admin', password: 'otra' })).rejects.toThrow(
      'Usuario o contraseña incorrectos',
    )
  })

  it('avisa cuando no hay conexión con el servidor', async () => {
    vi.mocked(api.get).mockRejectedValue(new AxiosError('network'))

    await expect(authService.login({ username: 'admin', password: 'Admin123' })).rejects.toThrow(
      'No se pudo conectar con el servidor',
    )
  })
})
