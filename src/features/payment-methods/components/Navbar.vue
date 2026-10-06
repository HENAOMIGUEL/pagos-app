<script setup lang="ts">
defineProps<{
  userName: string
}>()

const emit = defineEmits<{
  logout: []
}>()
</script>

<template>
  <q-toolbar class="navbar bg-primary text-white">
    <div class="navbar-title">Métodos de pago</div>

    <div class="navbar-user">
      <span>{{ userName }}</span>
      <q-btn
        flat
        round
        dense
        icon="logout"
        aria-label="Cerrar sesión"
        @click="emit('logout')"
      />
    </div>
  </q-toolbar>
</template>

<style scoped>
.navbar {
  position: relative;
  min-height: 64px;
}

.navbar-title {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 1.25rem;
  font-weight: 500;
  pointer-events: none;
}

.navbar-user {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  z-index: 1;
}
</style>
