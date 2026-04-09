<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import InfoContent from '@/components/InfoContent.vue';
import Header from './components/Header.vue';
import RampTestInput from './components/RampTestInput.vue';
import { PlusIcon } from 'lucide-vue-next';
import { ref } from 'vue';


const addStageRef = ref(null);
</script>

<template>
  <Header />
  <!-- <header>
    <div class="wrapper">
      <h1>Lactate Test Calculator</h1>
    </div>
  </header> -->

  <!-- <RouterView /> -->

  <div id='main'>
    <Tabs default-value="data-input">
      <TabsList>
        <TabsTrigger value="data-input"> Ramp Test Input </TabsTrigger>
        <TabsTrigger value="results"> Results </TabsTrigger>
      </TabsList>
      <TabsContent value="data-input">
        <div class='flex justify-between'>
          <h2>Ramp test input</h2>
          <Button @click='addStageRef' class='flex'>
            <h3 class='pr-2'>Add Stage</h3>
            <PlusIcon />
          </Button>
        </div>
        <!-- <RampDataInput /> -->
        <RampTestInput ref='addStageRef' />
      </TabsContent>
      <TabsContent value="results"> Results </TabsContent>
    </Tabs>

    <InfoContent></InfoContent>
  </div>
</template>

<style lang="css" scoped>
.app {
  width: 100vw;
}

h1 {
  font-weight: 800;
  font-size: 2.6rem;
  /* position: relative; */
  /* top: -10px; */
}
</style>
