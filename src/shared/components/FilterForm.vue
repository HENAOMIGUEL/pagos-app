<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { QForm } from 'quasar'

import type { FilterField, FilterOption } from '@/shared/types/filter-field'

const props = defineProps<{
  fields: FilterField[]
}>()

const emit = defineEmits<{
  search: [values: Record<string, string>]
}>()

const formRef = ref<QForm | null>(null)
const values = reactive<Record<string, string>>({})

watch(
  () => props.fields,
  (fields) => {
    for (const field of fields) {
      if (!(field.name in values)) {
        values[field.name] = ''
      }
    }
  },
  { immediate: true },
)

function selectOptions(field: FilterField): FilterOption[] {
  return (field.options ?? []).map((option) =>
    typeof option === 'string' ? { label: option, value: option } : option,
  )
}

function rules(field: FilterField) {
  if (!field.required) {
    return []
  }

  return [(value: string) => !!value || 'Completa este campo']
}

function onSearch() {
  const result: Record<string, string> = {}

  for (const field of props.fields) {
    const value = values[field.name]?.trim() ?? ''

    if (value) {
      result[field.name] = value
    }
  }

  emit('search', result)
}

function onClear() {
  for (const field of props.fields) {
    values[field.name] = ''
  }

  formRef.value?.resetValidation()
  emit('search', {})
}
</script>

<template>
  <q-card flat bordered>
    <q-card-section>
      <q-form ref="formRef" @submit.prevent="onSearch">
        <div class="row q-col-gutter-md items-start">
          <div v-for="field in fields" :key="field.name" class="col-12 col-md">
            <q-input
              v-if="field.type === 'text'"
              v-model="values[field.name]"
              :label="field.label"
              outlined
              dense
              bottom-slots
              :rules="rules(field)"
            />

            <q-select
              v-else
              v-model="values[field.name]"
              :label="field.label"
              :options="selectOptions(field)"
              outlined
              dense
              bottom-slots
              emit-value
              map-options
              :rules="rules(field)"
            />
          </div>

          <div class="col-12 col-md-auto">
            <div class="filter-actions">
              <q-btn label="Buscar" color="primary" type="submit" unelevated />
              <q-btn label="Limpiar" type="button" outline color="primary" @click="onClear" />
            </div>
          </div>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<style scoped>
.filter-actions {
  display: flex;
  gap: 8px;
  height: 40px;
  align-items: center;
}
</style>
