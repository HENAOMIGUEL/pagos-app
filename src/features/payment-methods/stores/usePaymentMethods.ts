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

  return { items, loading, errorMessage, load }
})
