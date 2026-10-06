<script setup lang="ts">
import { reactive } from 'vue'

const form = reactive({
  username: '',
  password: '',
})

function onSubmit() {
  return {
    username: form.username,
    password: form.password,
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
            v-model="form.username"
            label="Usuario"
            autocomplete="username"
            outlined
            :rules="[(value) => !!value || 'Ingresa tu usuario']"
          />

          <q-input
            v-model="form.password"
            label="Contraseña"
            type="password"
            autocomplete="current-password"
            outlined
            :rules="[(value) => !!value || 'Ingresa tu contraseña']"
          />

          <q-btn class="full-width" color="primary" label="Entrar" type="submit" />
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
