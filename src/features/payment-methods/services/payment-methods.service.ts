import axios from 'axios'

import { api } from '@/core/http/api'
import type { PaymentMethod } from '@/features/payment-methods/types/payment-method'

export const paymentMethodsService = {
  async getAll(): Promise<PaymentMethod[]> {
    try {
      const response = await api.get<PaymentMethod[]>('/paymentMethods')
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error('No se pudieron cargar los métodos de pago')
      }

      throw error
    }
  },

  async updateStatus(id: number | string, status: string): Promise<void> {
    try {
      await api.patch(`/paymentMethods/${id}`, { status })
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error('No se pudo actualizar el método de pago')
      }

      throw error
    }
  },
}
