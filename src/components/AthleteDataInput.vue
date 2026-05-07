<script setup lang="ts">
import { Input } from './ui/input'
import type { RampTest } from '@/lib/models'

const props = defineProps<{
  modelValue: RampTest
}>()

const emit = defineEmits<{
  'update:modelValue': [data: RampTest]
}>()

function updateAthleteName(newName: string) {
  emit('update:modelValue', {
    name: newName,
    weight: props.modelValue.weight,
    sport: props.modelValue.sport,
    stages: props.modelValue.stages,
  })
}

function updateAthleteWeight(newWeight: number) {
  emit('update:modelValue', {
    name: props.modelValue.name,
    weight: newWeight,
    sport: props.modelValue.sport,
    stages: props.modelValue.stages,
  })
}
</script>

<template>
  <div>
    <h2>Athlete Data</h2>
    <div class="flex">
      <Input
        type="text"
        placeholder="Rider Name"
        :model-value="props.modelValue.name ?? undefined"
        @update:model-value="(v) => updateAthleteName(String(v))"
        class="w-60"
        style="margin-right: 12px"
      />
      <Input
        type="number"
        placeholder="Rider Weight (kg)"
        :model-value="props.modelValue.weight ?? undefined"
        @update:model-value="(v) => updateAthleteWeight(Number(v))"
        class="w-60"
      />
    </div>
  </div>
</template>

<style lang="css" scoped></style>
