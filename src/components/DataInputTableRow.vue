<script setup lang="ts">
import { Input } from './ui/input';

const stage = 1;
</script>

<template>
  <div class="flex justify-baseline">
    <p class='font-extrabold text-xl'>{{ stage }}</p>
    <Input type='number' :placeholder="'Power ' + stage + ' (W)'" />
    <Input type='number' :placeholder="'Duration ' + stage + ' (s)'" />
    <Input type='number' :placeholder="'Lactate ' + stage + ' (mmol/L)'" />
  </div>
</template>
