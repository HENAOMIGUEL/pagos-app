import { ref } from 'vue'
import { defineStore } from 'pinia'

import { paymentMethodsService } from '@/features/payment-methods/services/payment-methods.service'
import type { PaymentMethod } from '@/features/payment-methods/types/payment-method'

export const usePaymentMethods = defineStore('payment-methods', () => {
  const items = ref<PaymentMethod[]>([])
  const loading = ref(false)
  const errorMessage = ref('')

  async function load() {
    loading.value = true
    errorMessage.value = ''

    try {
      items.value = await paymentMethodsService.getAll()
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : 'No se pudieron cargar los métodos de pago'
    } finally {
      loading.value = false
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

  return { items, loading, errorMessage, load, toggleStatus }
})
