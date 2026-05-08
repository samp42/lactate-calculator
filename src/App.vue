<script setup lang="ts">
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import InfoContent from '@/components/InfoContent.vue'
import Header from './components/Header.vue'
import RampTestInput from './components/RampTestInput.vue'
import { ref, watch, type Ref } from 'vue'
import type { RampTest } from '@/lib/models'
import ResultsData from './components/ResultsData.vue'
import AthleteDataInput from './components/AthleteDataInput.vue'
import { getFirstEmptyStage, getFictiveStages } from './lib/models'

const ramp_test: Ref<RampTest> = ref({
  name: null,
  weight: null,
  sport: 'cycling',
  stages: getFirstEmptyStage(),
})

watch(ramp_test, () => console.log(JSON.stringify(ramp_test.value)))
</script>

<template>
  <div>
    <Header />

    <div id="main">
      <div class="flex w-full">
        <Tabs default-value="data-input" class="flex w-full">
          <TabsList class="mb-8 m-auto w-full">
            <TabsTrigger value="data-input">
              <h3>Ramp Test Input</h3>
            </TabsTrigger>
            <TabsTrigger value="results">
              <h3>Results & Calculations</h3>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="data-input" style="margin-top: 24px">
            <div class="pb-8">
              <AthleteDataInput :modelValue="ramp_test" @update:modelValue="ramp_test = $event" />
            </div>
            <RampTestInput
              :modelValue="ramp_test"
              @update:modelValue="ramp_test = $event"
              ref="addStageRef"
            />
          </TabsContent>
          <TabsContent value="results" style="margin-top: 24px">
            <div>
              <ResultsData :ramp_test="ramp_test" />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <!-- <InfoContent /> -->
    </div>
  </div>
</template>

<style lang="css" scoped>
#main {
  margin-top: 120px;
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
