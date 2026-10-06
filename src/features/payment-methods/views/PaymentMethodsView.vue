<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import Navbar from '@/features/payment-methods/components/Navbar.vue'
import PaymentMethodsTable from '@/features/payment-methods/components/PaymentMethodsTable.vue'
import { useAuth } from '@/features/auth/stores/useAuth'
import { usePaymentMethods } from '@/features/payment-methods/stores/usePaymentMethods'

const auth = useAuth()
const router = useRouter()
const paymentMethods = usePaymentMethods()

onMounted(() => {
  paymentMethods.load()
})

function onLogout() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <div>
    <Navbar :user-name="auth.user?.name ?? ''" @logout="onLogout" />

    <main class="content">
      <q-banner v-if="paymentMethods.errorMessage" class="bg-red-1 text-negative q-mb-md" rounded>
        {{ paymentMethods.errorMessage }}
      </q-banner>

      <PaymentMethodsTable :rows="paymentMethods.items" :loading="paymentMethods.loading" />
    </main>
  </div>
</template>

<style scoped>
.content {
  padding: 24px;
}
</style>
