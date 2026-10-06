import axios from 'axios'

import { api } from '@/core/http/api'
import type {
  PaymentMethod,
  PaymentMethodInput,
} from '@/features/payment-methods/types/payment-method'

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

  async create(
    paymentMethod: PaymentMethodInput & { status: string; createdAt: string },
  ): Promise<PaymentMethod> {
    try {
      const response = await api.post<PaymentMethod>('/paymentMethods', paymentMethod)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error('No se pudo crear el método de pago')
      }

      throw error
    }
  },

  async update(id: number | string, paymentMethod: PaymentMethodInput): Promise<PaymentMethod> {
    try {
      const response = await api.patch<PaymentMethod>(`/paymentMethods/${id}`, paymentMethod)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error('No se pudo actualizar el método de pago')
      }

      throw error
    }
  },

  async remove(id: number | string): Promise<void> {
    try {
      await api.delete(`/paymentMethods/${id}`)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error('No se pudo eliminar el método de pago')
      }

      throw error
    }
  },
}
