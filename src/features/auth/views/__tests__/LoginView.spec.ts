import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { QInput, Quasar } from 'quasar'

const { push } = vi.hoisted(() => ({ push: vi.fn() }))

Object.defineProperty(window.screen, 'orientation', {
  configurable: true,
  value: {
    type: 'landscape-primary',
    angle: 0,
    addEventListener: () => {},
    removeEventListener: () => {},
  },
})

vi.mock('vue-router', () => ({
  useRouter: () => ({ push }),
}))

vi.mock('@/features/auth/services/auth.service', () => ({
  authService: {
    login: vi.fn(),
  },
}))

import { authService } from '@/features/auth/services/auth.service'
import type { AuthUser } from '@/features/auth/types/auth'
import LoginView from '@/features/auth/views/LoginView.vue'

const authUser: AuthUser = {
  id: '1',
  username: 'admin',
  password: 'Admin123',
  name: 'Administrador',
  role: 'admin',
}

function mountLogin() {
  return mount(LoginView, {
    global: {
      plugins: [createPinia(), Quasar],
    },
  })
}

describe('LoginView', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    push.mockReset()
    vi.mocked(authService.login).mockReset()
  })

  it('entra a métodos de pago cuando las credenciales son válidas', async () => {
    vi.mocked(authService.login).mockResolvedValue(authUser)
    const wrapper = mountLogin()
    const inputs = wrapper.findAllComponents(QInput)
    const username = inputs[0]
    const password = inputs[1]

    if (!username || !password) {
      throw new Error('El formulario de login no renderizó los campos')
    }

    await username.setValue('admin')
    await password.setValue('Admin123')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(authService.login).toHaveBeenCalledWith({ username: 'admin', password: 'Admin123' })
    expect(push).toHaveBeenCalledWith({ name: 'payment-methods' })
  })
})
