<script setup lang="ts">
import { MoonIcon, SunIcon } from 'lucide-vue-next';
import { ref } from 'vue';

const theme = ref('dark');

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
}
</script>

<template>
  <div class='header-div px-8 py-2'>
    <h1>Lactate Test Calculator</h1>

    <div class='flex'>
      <p>{{ theme }}</p>
      <Button class='flex' @click='toggleTheme'>
        <MoonIcon v-if='theme === "light"' />
        <SunIcon v-if='theme === "dark"' />
      </Button>
    </div>
  </div>
</template>

<style lang='css'>
.header-div {
  position: absolute;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
