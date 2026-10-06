import axios from 'axios'

import { api } from '@/core/http/api'
import type { AuthUser, LoginCredentials } from '@/features/auth/types/auth'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthUser> {
    let users: AuthUser[]

    try {
      const response = await api.get<AuthUser[]>('/users', {
        params: { username: credentials.username.trim() },
      })
      users = response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error('No se pudo conectar con el servidor')
      }

      throw error
    }

    const user = users.find((item) => item.password === credentials.password)

    if (!user) {
      throw new Error('Usuario o contraseña incorrectos')
    }

    return user
  },
}
