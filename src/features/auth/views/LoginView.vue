<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuth } from '@/features/auth/stores/useAuth'

const auth = useAuth()
const router = useRouter()

const loginForm = reactive({
  username: '',
  password: '',
})

const loading = ref(false)
const errorMessage = ref('')

async function onSubmit() {
  loading.value = true
  errorMessage.value = ''

  try {
    await auth.login(loginForm)
    await router.push({ name: 'payment-methods' })
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'No se pudo iniciar sesión'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <q-card class="login-form">
      <q-card-section>
        <div class="text-h5">Iniciar sesión</div>
      </q-card-section>

      <q-card-section>
        <q-form class="q-gutter-md" @submit.prevent="onSubmit">
          <q-input
            v-model="loginForm.username"
            label="Usuario"
            autocomplete="username"
            outlined
            :rules="[(value) => !!value || 'Ingresa tu usuario']"
          />

          <q-input
            v-model="loginForm.password"
            label="Contraseña"
            type="password"
            autocomplete="current-password"
            outlined
            :rules="[(value) => !!value || 'Ingresa tu contraseña']"
          />

          <q-banner v-if="errorMessage" class="bg-red-1 text-negative" rounded>
            {{ errorMessage }}
          </q-banner>

          <q-btn
            class="full-width"
            color="primary"
            label="Entrar"
            type="submit"
            :loading="loading"
          />
        </q-form>
      </q-card-section>
    </q-card>
  </main>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}

.login-form {
  width: 100%;
  max-width: 400px;
}
</style>
