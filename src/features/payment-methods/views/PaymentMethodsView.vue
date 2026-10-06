<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import Navbar from '@/features/payment-methods/components/Navbar.vue'
import PaymentMethodForm from '@/features/payment-methods/components/PaymentMethodForm.vue'
import PaymentMethodsTable from '@/features/payment-methods/components/PaymentMethodsTable.vue'
import FilterForm from '@/shared/components/FilterForm.vue'
import type { FilterField } from '@/shared/types/filter-field'
import { useAuth } from '@/features/auth/stores/useAuth'
import { usePaymentMethods } from '@/features/payment-methods/stores/usePaymentMethods'
import type {
  PaymentMethod,
  PaymentMethodInput,
} from '@/features/payment-methods/types/payment-method'

const auth = useAuth()
const router = useRouter()
const paymentMethods = usePaymentMethods()

const formOpen = ref(false)
const selected = ref<PaymentMethod | null>(null)
const deleteTarget = ref<PaymentMethod | null>(null)
const filters = ref<Record<string, string>>({})

const filterFields: FilterField[] = [
  { name: 'name', label: 'Nombre', type: 'text' },
  {
    name: 'type',
    label: 'Tipo',
    type: 'select',
    options: ['Tarjeta de crédito', 'Tarjeta débito', 'Cuenta bancaria', 'Billetera digital'],
  },
  {
    name: 'status',
    label: 'Estado',
    type: 'select',
    options: [
      { label: 'Activo', value: 'active' },
      { label: 'Inactivo', value: 'inactive' },
    ],
  },
]

const filteredItems = computed(() =>
  paymentMethods.items.filter((item) =>
    Object.entries(filters.value).every(([key, value]) => {
      const field = filterFields.find((entry) => entry.name === key)
      const current = String(item[key as keyof PaymentMethod] ?? '')

      if (field?.type === 'text') {
        return current.toLowerCase().includes(value.toLowerCase())
      }

      return current === value
    }),
  ),
)

onMounted(() => {
  paymentMethods.load()
})

function onLogout() {
  auth.logout()
  router.push({ name: 'login' })
}

function openCreate() {
  selected.value = null
  formOpen.value = true
}

function openEdit(paymentMethod: PaymentMethod) {
  selected.value = paymentMethod
  formOpen.value = true
}

async function onSave(value: PaymentMethodInput) {
  const saved = selected.value
    ? await paymentMethods.update(selected.value.id, value)
    : await paymentMethods.create(value)

  if (saved) {
    formOpen.value = false
  }
}

async function confirmDelete() {
  if (!deleteTarget.value) {
    return
  }

  const removed = await paymentMethods.remove(deleteTarget.value.id)

  if (removed) {
    deleteTarget.value = null
  }
}
</script>

<template>
  <div>
    <Navbar :user-name="auth.user?.name ?? ''" @logout="onLogout" />

    <main class="content">
      <div class="row justify-end q-mb-md">
        <q-btn color="primary" label="Nuevo método de pago" @click="openCreate" />
      </div>

      <FilterForm class="q-mb-md" :fields="filterFields" @search="filters = $event" />

      <q-banner v-if="paymentMethods.errorMessage" class="bg-red-1 text-negative q-mb-md" rounded>
        {{ paymentMethods.errorMessage }}
      </q-banner>

      <PaymentMethodsTable
        :rows="filteredItems"
        @toggle="paymentMethods.toggleStatus"
        @edit="openEdit"
        @remove="deleteTarget = $event"
      />
    </main>

    <PaymentMethodForm v-model:open="formOpen" :payment-method="selected" @save="onSave" />

    <q-dialog
      :model-value="deleteTarget !== null"
      @update:model-value="(open) => { if (!open) deleteTarget = null }"
    >
      <q-card class="confirm-card">
        <q-card-section>
          <div class="text-h6">Eliminar método de pago</div>
        </q-card-section>

        <q-card-section>
          ¿Eliminar {{ deleteTarget?.name }}? Esta acción no se puede deshacer.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" @click="deleteTarget = null" />
          <q-btn label="Eliminar" color="negative" @click="confirmDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<style scoped>
.content {
  padding: 24px;
}

.confirm-card {
  width: 100%;
  max-width: 420px;
}
</style>
