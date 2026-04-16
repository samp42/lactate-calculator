<script setup lang="ts">
import { Input } from './ui/input';
import type { RampTest } from '@/lib/models';

const props = defineProps<{
  modelValue: RampTest
}>()

const emit = defineEmits<{
  'update:modelValue': [data: RampTest],
}>()

function updateAthleteName(newName: string) {
  emit('update:modelValue', { name: newName, weight: props.modelValue.weight, stages: props.modelValue.stages });
}

function updateAthleteWeight(newWeight: number) {
  emit('update:modelValue', { name: props.modelValue.name, weight: newWeight, stages: props.modelValue.stages });
}
</script>

<template>
  <div>
    <h2>Athlete Data</h2>
    <div>
      <Input type='text' placeholder='Rider Name' :model-value='props.modelValue.name'
        @update:model-value='updateAthleteName' class='w-60' style='margin-right: 12px' />
      <Input type='number' placeholder='Rider Weight' :model-value='props.modelValue.weight'
        @update:model-value='updateAthleteWeight' class='w-60' />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
