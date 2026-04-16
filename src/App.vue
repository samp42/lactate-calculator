<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import InfoContent from '@/components/InfoContent.vue';
import Header from './components/Header.vue';
import RampTestInput from './components/RampTestInput.vue';
import { ref, watch, type Ref } from 'vue';
import { Button } from '@/components/ui/button';
import type { RampTest } from '@/lib/models'
import ResultsData from './components/ResultsData.vue';
import AthleteDataInput from './components/AthleteDataInput.vue';

const ramp_test: Ref<RampTest> = ref({ name: null, weight: null, stages: [{ num: 1, power: null, duration: null, lactate: null, heart_rate: null }] })

function addStage() {
  if (ramp_test.value.stages.length > 0) {
    const lastStage = ramp_test.value.stages[ramp_test.value.stages.length - 1];

    ramp_test.value.stages = [...ramp_test.value.stages, { num: lastStage!.num + 1, power: null, duration: lastStage!.duration, lactate: null, heart_rate: null }];
  } else {
    ramp_test.value.stages = [{ num: 1, power: null, duration: null, lactate: null, heart_rate: null }];
  }
}

watch(ramp_test, () => console.log(JSON.stringify(ramp_test.value)))

const addStageRef = ref(null);
</script>

<template>
  <div>
    <Header />

    <div id="main">
      <div class="flex w-full">
        <Tabs default-value="data-input">
          <TabsList>
            <TabsTrigger value="data-input">
              <h3>Ramp Test Input</h3>
            </TabsTrigger>
            <TabsTrigger value="results">
              <h3>Results & Calculations</h3>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="data-input">
            <!-- <RampDataInput /> -->
            <div class="pb-10px">
              <AthleteDataInput :modelValue="ramp_test" @update:modelValue="ramp_test = $event" />
            </div>
            <RampTestInput :modelValue="ramp_test" @update:modelValue="ramp_test = $event" ref="addStageRef" />
            <div>
              <Button @click="console.log('redirect')">Go to Results</Button>
            </div>
          </TabsContent>
          <TabsContent value="results">
            <div>
              <ResultsData :ramp_test="ramp_test" />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <InfoContent></InfoContent>
    </div>
  </div>
</template>

<style lang="css" scoped>
#main {
  margin-top: 80px;
}

/* .app {
  width: 100vw;
} */

h1 {
  font-weight: 800;
  font-size: 2.6rem;
  /* position: relative; */
  /* top: -10px; */
}
</style>
