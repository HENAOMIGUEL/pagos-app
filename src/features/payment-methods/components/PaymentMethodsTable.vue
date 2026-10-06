<script setup lang="ts">
import type { QTableProps } from 'quasar'

import type { PaymentMethod } from '@/features/payment-methods/types/payment-method'

defineProps<{
  rows: PaymentMethod[]
  loading: boolean
}>()

const columns: QTableProps['columns'] = [
  { name: 'name', label: 'Nombre', field: 'name', align: 'left' },
  { name: 'type', label: 'Tipo', field: 'type', align: 'left' },
  { name: 'description', label: 'Descripción', field: 'description', align: 'left' },
  {
    name: 'status',
    label: 'Estado',
    field: 'status',
    align: 'left',
    format: (value: string) => (value === 'active' ? 'Activo' : 'Inactivo'),
  },
  {
    name: 'createdAt',
    label: 'Fecha',
    field: 'createdAt',
    align: 'left',
    format: (value: string) => formatDate(value),
  },
]

function formatDate(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleString('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}
</script>

<template>
  <q-table
    :rows="rows"
    :columns="columns"
    :loading="loading"
    row-key="id"
    flat
    bordered
    no-data-label="No hay métodos de pago"
  />
</template>
