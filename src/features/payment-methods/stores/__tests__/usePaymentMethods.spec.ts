import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { Notify } from 'quasar'

import type { PaymentMethod } from '@/features/payment-methods/types/payment-method'

vi.mock('quasar', () => ({
  Notify: {
    create: vi.fn(),
  },
}))

vi.mock('@/features/payment-methods/services/payment-methods.service', () => ({
  paymentMethodsService: {
    getAll: vi.fn(),
    updateStatus: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  },
}))

import { paymentMethodsService } from '@/features/payment-methods/services/payment-methods.service'
import { usePaymentMethods } from '@/features/payment-methods/stores/usePaymentMethods'

function method(overrides: Partial<PaymentMethod> = {}): PaymentMethod {
  return {
    id: '1',
    name: 'Visa',
    type: 'Tarjeta de crédito',
    description: 'Tarjeta Visa terminada en 4242',
    status: 'active',
    createdAt: '2026-09-15T10:30:00',
    ...overrides,
  }
}

describe('usePaymentMethods', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.mocked(paymentMethodsService.getAll).mockReset()
    vi.mocked(paymentMethodsService.updateStatus).mockReset()
    vi.mocked(paymentMethodsService.create).mockReset()
    vi.mocked(paymentMethodsService.update).mockReset()
    vi.mocked(paymentMethodsService.remove).mockReset()
    vi.mocked(Notify.create).mockReset()
  })

  it('llena la lista al cargar', async () => {
    const visa = method()
    vi.mocked(paymentMethodsService.getAll).mockResolvedValue([visa])
    const paymentMethods = usePaymentMethods()

    await paymentMethods.load()

    expect(paymentMethods.items).toEqual([visa])
    expect(paymentMethods.errorMessage).toBe('')
  })

  it('desactiva un método activo', async () => {
    const visa = method({ status: 'active' })
    vi.mocked(paymentMethodsService.getAll).mockResolvedValue([visa])
    vi.mocked(paymentMethodsService.updateStatus).mockResolvedValue()
    const paymentMethods = usePaymentMethods()

    await paymentMethods.load()
    await paymentMethods.toggleStatus(visa)

    expect(visa.status).toBe('inactive')
    expect(paymentMethodsService.updateStatus).toHaveBeenCalledWith('1', 'inactive')
  })

  it('recupera el estado anterior si el cambio falla', async () => {
    const visa = method({ status: 'active' })
    vi.mocked(paymentMethodsService.getAll).mockResolvedValue([visa])
    vi.mocked(paymentMethodsService.updateStatus).mockRejectedValue(
      new Error('No se pudo actualizar el método de pago'),
    )
    const paymentMethods = usePaymentMethods()

    await paymentMethods.load()
    await paymentMethods.toggleStatus(visa)

    expect(visa.status).toBe('active')
    expect(paymentMethods.errorMessage).toBe('No se pudo actualizar el método de pago')
  })

  it('agrega el método creado como activo', async () => {
    const input = { name: 'Nequi', type: 'Billetera digital', description: '' }
    const created = method({ id: '9', ...input, status: 'active' })
    vi.mocked(paymentMethodsService.create).mockResolvedValue(created)
    const paymentMethods = usePaymentMethods()

    await expect(paymentMethods.create(input)).resolves.toBe(true)

    expect(paymentMethodsService.create).toHaveBeenCalledWith(
      expect.objectContaining({ ...input, status: 'active' }),
    )
    expect(paymentMethods.items).toEqual([created])
    expect(Notify.create).toHaveBeenCalledWith({
      type: 'positive',
      message: 'Método de pago guardado',
    })
  })

  it('no agrega el método y publica el error si crear falla', async () => {
    vi.mocked(paymentMethodsService.create).mockRejectedValue(
      new Error('No se pudo crear el método de pago'),
    )
    const paymentMethods = usePaymentMethods()

    await expect(
      paymentMethods.create({ name: 'Nequi', type: 'Billetera digital', description: '' }),
    ).resolves.toBe(false)

    expect(paymentMethods.items).toEqual([])
    expect(paymentMethods.errorMessage).toBe('No se pudo crear el método de pago')
    expect(Notify.create).not.toHaveBeenCalled()
  })

  it('reemplaza el método editado', async () => {
    const visa = method({ id: '1', name: 'Visa' })
    const mastercard = method({ id: '2', name: 'Mastercard' })
    const updated = method({ id: '1', name: 'Visa Gold' })
    vi.mocked(paymentMethodsService.getAll).mockResolvedValue([visa, mastercard])
    vi.mocked(paymentMethodsService.update).mockResolvedValue(updated)
    const paymentMethods = usePaymentMethods()

    await paymentMethods.load()
    await expect(
      paymentMethods.update('1', {
        name: 'Visa Gold',
        type: visa.type,
        description: visa.description,
      }),
    ).resolves.toBe(true)

    expect(paymentMethods.items).toEqual([updated, mastercard])
    expect(Notify.create).toHaveBeenCalledWith({
      type: 'positive',
      message: 'Método de pago actualizado',
    })
  })

  it('quita el método eliminado de la lista', async () => {
    const visa = method({ id: '1' })
    const mastercard = method({ id: '2', name: 'Mastercard' })
    vi.mocked(paymentMethodsService.getAll).mockResolvedValue([visa, mastercard])
    vi.mocked(paymentMethodsService.remove).mockResolvedValue()
    const paymentMethods = usePaymentMethods()

    await paymentMethods.load()
    await expect(paymentMethods.remove('1')).resolves.toBe(true)

    expect(paymentMethods.items).toEqual([mastercard])
    expect(Notify.create).toHaveBeenCalledWith({
      type: 'positive',
      message: 'Método de pago eliminado',
    })
  })
})
