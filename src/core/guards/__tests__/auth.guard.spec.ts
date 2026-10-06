import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { RouteLocationNormalized } from 'vue-router'

import { authGuard } from '@/core/guards/auth.guard'

function toRoute(name: string, requiresAuth = false) {
  return {
    name,
    meta: { requiresAuth },
  } as RouteLocationNormalized
}

describe('authGuard', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('manda al login si la ruta exige sesión y no hay usuario', () => {
    const result = authGuard(toRoute('payment-methods', true), toRoute('login'), () => {})

    expect(result).toEqual({ name: 'login' })
  })

  it('manda a métodos de pago si ya hay sesión y se abre el login', () => {
    localStorage.setItem(
      'auth-user',
      JSON.stringify({ id: '1', username: 'admin', name: 'Administrador', role: 'admin' }),
    )

    const result = authGuard(toRoute('login'), toRoute('payment-methods'), () => {})

    expect(result).toEqual({ name: 'payment-methods' })
  })

  it('deja pasar la ruta protegida si ya hay sesión', () => {
    localStorage.setItem(
      'auth-user',
      JSON.stringify({ id: '1', username: 'admin', name: 'Administrador', role: 'admin' }),
    )

    const result = authGuard(toRoute('payment-methods', true), toRoute('login'), () => {})

    expect(result).toBe(true)
  })
})
