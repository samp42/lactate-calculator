<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import InfoContent from '@/components/InfoContent.vue';
import Header from './components/Header.vue';
import RampTestInput from './components/RampTestInput.vue';
import { PlusIcon } from 'lucide-vue-next';
import { ref, type Ref } from 'vue';
import { Button } from './components/ui/button';
import type { RampTest } from '@/lib/models'
import ResultsData from './components/ResultsData.vue';

const ramp_test: Ref<RampTest> = ref({ stages: [{ num: 1, power: null, duration: null, lactate: null }] })

function addStage() {
  if (ramp_test.value.stages.length > 0) {
    const lastStage = ramp_test.value.stages[ramp_test.value.stages.length - 1];

    ramp_test.value.stages = [...ramp_test.value.stages, { num: lastStage!.num + 1, power: null, duration: lastStage!.duration, lactate: null }];
  } else {
    ramp_test.value.stages = [{ num: 1, power: null, duration: null, lactate: null }];
  }
}

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
          <Button @click='addStage' class='flex'>
            <h3 class='pr-2'>Add Stage</h3>
            <PlusIcon />
          </Button>
        </div>
        <!-- <RampDataInput /> -->
        <RampTestInput :modelValue="ramp_test" @update:modelValue="ramp_test = $event" ref="addStageRef" />
        <div>
          <Button @click='console.log("redirect")'>Go to Results</Button>
        </div>
      </TabsContent>
      <TabsContent value="results">
        <div>
          <ResultsData :ramp_test="ramp_test" />
        </div>
      </TabsContent>
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
