<script setup lang="ts">
import { MoonIcon, SunIcon } from 'lucide-vue-next'
import { ref } from 'vue'

const theme = ref('dark')

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <div class="header-div px-8 py-2 bg-black flex items-center">
    <img src="@/assets/ToguriLogo.webp" alt="Toguri Logo" class="h-12 pr-4" />
    <h1 class="text-white text-2xl font-bold">Lactate Test Calculator</h1>

    <!-- <div class="flex">
      <p>{{ theme }}</p>
      <Button class="flex" @click="toggleTheme">
        <MoonIcon v-if="theme === 'light'" />
        <SunIcon v-if="theme === 'dark'" />
      </Button>
    </div> -->
  </div>
</template>

<style lang="css">
.header-div {
  position: absolute;
  top: 0;
  width: 100%;
  display: flex;
}
</style>
