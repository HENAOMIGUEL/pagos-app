export interface PaymentMethodInput {
  name: string
  type: string
  description: string
}

export interface PaymentMethod extends PaymentMethodInput {
  id: number | string
  status: string
  createdAt: string
}
