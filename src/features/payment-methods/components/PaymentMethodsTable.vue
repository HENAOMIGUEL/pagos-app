<script setup lang="ts">
import { computed } from 'vue'
import type { QTableProps } from 'quasar'

import type { PaymentMethod } from '@/features/payment-methods/types/payment-method'

const props = defineProps<{
  rows: PaymentMethod[]
  isAdmin: boolean
}>()

const emit = defineEmits<{
  toggle: [paymentMethod: PaymentMethod]
  edit: [paymentMethod: PaymentMethod]
  remove: [paymentMethod: PaymentMethod]
}>()

const columns = computed(() => {
  const base: QTableProps['columns'] = [
    { name: 'name', label: 'Nombre', field: 'name', align: 'left' },
    { name: 'type', label: 'Tipo', field: 'type', align: 'left' },
    { name: 'description', label: 'Descripción', field: 'description', align: 'left' },
    { name: 'status', label: 'Estado', field: 'status', align: 'left' },
    {
      name: 'createdAt',
      label: 'Fecha',
      field: 'createdAt',
      align: 'left',
      format: (value: string) => formatDate(value),
    },
  ]

  if (props.isAdmin) {
    base.push({ name: 'actions', label: 'Acciones', field: 'id', align: 'right' })
  }

  return base
})

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
    row-key="id"
    flat
    bordered
    no-data-label="No hay métodos de pago"
  >
    <template #body-cell-status="props">
      <q-td :props="props">
        <q-toggle
          v-if="isAdmin"
          :model-value="props.row.status === 'active'"
          :label="props.row.status === 'active' ? 'Activo' : 'Inactivo'"
          color="primary"
          @update:model-value="emit('toggle', props.row)"
        />
        <span v-else>{{ props.row.status === 'active' ? 'Activo' : 'Inactivo' }}</span>
      </q-td>
    </template>

    <template #body-cell-actions="props">
      <q-td :props="props">
        <q-btn
          flat
          round
          dense
          icon="edit"
          aria-label="Editar"
          @click="emit('edit', props.row)"
        />
        <q-btn
          flat
          round
          dense
          icon="delete"
          color="negative"
          aria-label="Eliminar"
          @click="emit('remove', props.row)"
        />
      </q-td>
    </template>
  </q-table>
</template>

<style scoped>
:deep(.q-table thead th) {
  color: #1a1a1a;
  font-weight: 600;
}
</style>
