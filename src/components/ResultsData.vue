<script setup lang="ts">
import ResultsTable from './ResultsTable.vue';
import type { RampTest } from '@/lib/models';

const props = defineProps<{
  ramp_test: RampTest
}>();
</script>

<template>
  <h2>Ramp Test Power</h2>
  <ResultsTable :ramp_test="ramp_test" />
  <h2>Power & Lactate Curve</h2>
  <div>
    <Select>
      <SelectTrigger class="w-[180px]">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>

    </Select>
  </div>
  <h2>Power & Lactate Data</h2>
</template>
