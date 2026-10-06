<script setup lang="ts">
import { reactive, watch } from 'vue'

import type { PaymentMethod } from '@/features/payment-methods/types/payment-method'

const paymentMethodTypes = [
  'Tarjeta de crédito',
  'Tarjeta débito',
  'Cuenta bancaria',
  'Billetera digital',
]

const props = defineProps<{
  open: boolean
  paymentMethod: PaymentMethod | null
}>()

const emit = defineEmits<{
  'update:open': [value: boolean]
  save: [value: { name: string; type: string; description: string }]
}>()

const form = reactive({
  name: '',
  type: '',
  description: '',
})

watch(
  () => props.open,
  (open) => {
    if (!open) {
      return
    }

    form.name = props.paymentMethod?.name ?? ''
    form.type = props.paymentMethod?.type ?? ''
    form.description = props.paymentMethod?.description ?? ''
  },
)

function close() {
  emit('update:open', false)
}

function onSubmit() {
  emit('save', {
    name: form.name.trim(),
    type: form.type,
    description: form.description.trim(),
  })
}
</script>

<template>
  <q-dialog :model-value="open" @update:model-value="emit('update:open', $event)">
    <q-card class="form-card">
      <q-card-section>
        <div class="text-h6">
          {{ paymentMethod ? 'Editar método de pago' : 'Nuevo método de pago' }}
        </div>
      </q-card-section>

      <q-card-section>
        <q-form class="q-gutter-md" @submit.prevent="onSubmit">
          <q-input
            v-model="form.name"
            label="Nombre"
            outlined
            :rules="[(value) => !!value || 'Ingresa el nombre']"
          />

          <q-select
            v-model="form.type"
            label="Tipo"
            outlined
            :options="paymentMethodTypes"
            :rules="[(value) => !!value || 'Selecciona un tipo']"
          />

          <q-input v-model="form.description" label="Descripción" outlined type="textarea" />

          <div class="row justify-end q-gutter-sm">
            <q-btn flat label="Cancelar" color="primary" @click="close" />
            <q-btn label="Guardar" color="primary" type="submit" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style scoped>
.form-card {
  width: 100%;
  max-width: 480px;
}
</style>
