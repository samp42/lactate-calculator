<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import InfoContent from '@/components/InfoContent.vue'
import RampDataInput from './components/RampDataInput.vue';
import Header from './components/Header.vue';
</script>

<template>
  <Header />
  <header>
    <div class="wrapper">
      <h1>Lactate Test Calculator</h1>
    </div>
  </header>

  <!-- <RouterView /> -->

  <Tabs default-value="data-input">
    <TabsList>
      <TabsTrigger value="data-input"> Ramp Test Input </TabsTrigger>
      <TabsTrigger value="results"> Results </TabsTrigger>
    </TabsList>
    <TabsContent value="data-input">
      <h2>Ramp test input</h2>
      <RampDataInput />
    </TabsContent>
    <TabsContent value="results"> Results </TabsContent>
  </Tabs>

  <InfoContent></InfoContent>
</template>

<style lang="css" scoped>
h1 {
  font-weight: 800;
  font-size: 2.6rem;
  /* position: relative; */
  /* top: -10px; */
}
</style>
