<script setup lang="ts">
import { ref } from 'vue';
import DataInputTableRow from './DataInputTableRow.vue';

// Reactive array to hold stages
const stages = ref<number[]>([1]);

function addRow() {
  const last = stages.value[stages.value.length - 1] ?? 0;
  stages.value.push(last + 1);
}

function deleteRow(stage: number) {
  stages.value = stages.value.filter((s) => s !== stage);
}
</script>

<template>
  <table class="min-w-full border-collapse">
    <thead>
      <tr>
        <th class="border p-2">#</th>
        <th class="border p-2">Power (W)</th>
        <th class="border p-2">Duration (s)</th>
        <th class="border p-2">Lactate (mmol/L)</th>
        <th class="border p-2">Action</th>
      </tr>
    </thead>
    <tbody>
      <DataInputTableRow v-for="stage in stages" :key="stage" :stage="stage" @delete="deleteRow" />
    </tbody>
  </table>
  <div class="mt-4">
    <button @click="addRow" class="px-4 py-2 bg-primary text-white rounded">Add Row</button>
  </div>
</template>
