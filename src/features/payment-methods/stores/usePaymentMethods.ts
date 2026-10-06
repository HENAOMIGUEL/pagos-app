import { ref } from 'vue'
import { defineStore } from 'pinia'
import { Notify } from 'quasar'

import { paymentMethodsService } from '@/features/payment-methods/services/payment-methods.service'
import type {
  PaymentMethod,
  PaymentMethodInput,
} from '@/features/payment-methods/types/payment-method'

export const usePaymentMethods = defineStore('payment-methods', () => {
  const items = ref<PaymentMethod[]>([])
  const errorMessage = ref('')

  async function load() {
    errorMessage.value = ''

    try {
      items.value = await paymentMethodsService.getAll()
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : 'No se pudieron cargar los métodos de pago'
    }
  }

  async function toggleStatus(paymentMethod: PaymentMethod) {
    const item = items.value.find((row) => row.id === paymentMethod.id)

    if (!item) {
      return
    }

    const previous = item.status
    item.status = previous === 'active' ? 'inactive' : 'active'
    errorMessage.value = ''

    try {
      await paymentMethodsService.updateStatus(item.id, item.status)
    } catch (error) {
      item.status = previous
      errorMessage.value =
        error instanceof Error ? error.message : 'No se pudo actualizar el método de pago'
    }
  }

  async function create(paymentMethod: PaymentMethodInput) {
    errorMessage.value = ''

    try {
      const created = await paymentMethodsService.create({
        ...paymentMethod,
        status: 'active',
        createdAt: new Date().toISOString(),
      })
      items.value.push(created)
      Notify.create({ type: 'positive', message: 'Método de pago guardado' })
      return true
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : 'No se pudo crear el método de pago'
      return false
    }
  }

  async function update(id: number | string, paymentMethod: PaymentMethodInput) {
    errorMessage.value = ''

    try {
      const updated = await paymentMethodsService.update(id, paymentMethod)
      const index = items.value.findIndex((row) => row.id === id)

      if (index !== -1) {
        items.value[index] = updated
      }

      Notify.create({ type: 'positive', message: 'Método de pago actualizado' })
      return true
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : 'No se pudo actualizar el método de pago'
      return false
    }
  }

  async function remove(id: number | string) {
    errorMessage.value = ''

    try {
      await paymentMethodsService.remove(id)
      items.value = items.value.filter((row) => row.id !== id)
      Notify.create({ type: 'positive', message: 'Método de pago eliminado' })
      return true
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : 'No se pudo eliminar el método de pago'
      return false
    }
  }

  return { items, errorMessage, load, toggleStatus, create, update, remove }
})
