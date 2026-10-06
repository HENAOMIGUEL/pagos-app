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
  <q-form ref="formRef" class="q-gutter-md" @submit.prevent="onSearch">
    <div class="row q-col-gutter-md">
      <div v-for="field in fields" :key="field.name" class="col-12 col-sm-4">
        <q-input
          v-if="field.type === 'text'"
          v-model="values[field.name]"
          :label="field.label"
          outlined
          dense
          :rules="rules(field)"
        />

        <q-select
          v-else
          v-model="values[field.name]"
          :label="field.label"
          :options="selectOptions(field)"
          outlined
          dense
          emit-value
          map-options
          :rules="rules(field)"
        />
      </div>
    </div>

    <div class="row q-gutter-sm">
      <q-btn label="Buscar" color="primary" type="submit" />
      <q-btn label="Limpiar" type="button" flat color="primary" @click="onClear" />
    </div>
  </q-form>
</template>
