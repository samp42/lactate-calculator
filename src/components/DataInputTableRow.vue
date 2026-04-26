<script setup lang="ts">
import { CrossIcon, DeleteIcon, X } from 'lucide-vue-next'
import { Input } from './ui/input'
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{ stage: number }>()
const emit = defineEmits<{
  (e: 'delete', stage: number): void
}>()

function deleteRow() {
  emit('delete', props.stage)
}
</script>

<template>
  <tr>
    <td class="font-extrabold text-xl">{{ props.stage }}</td>
    <td>
      <Input
        type="number"
        :placeholder="'Power ' + props.stage + ' (W)'"
        class="data-input-input"
      />
    </td>
    <td>
      <Input
        type="number"
        :placeholder="'Duration ' + props.stage + ' (s)'"
        class="data-input-input"
      />
    </td>
    <td>
      <Input
        type="number"
        :placeholder="'Lactate ' + props.stage + ' (mmol/L)'"
        class="data-input-input"
      />
    </td>
    <td>
      <Button @click="deleteRow" class="text-red-500">
        <X />
      </Button>
    </td>
  </tr>
</template>

<style lang="css" scoped>
.data-input-input {
  max-width: 12em;
  margin-top: 0.5em;
}
</style>
