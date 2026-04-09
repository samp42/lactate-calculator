<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';
import {
  Table,
  TableCaption,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
} from './ui/table';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { XIcon } from 'lucide-vue-next';


interface RampTestStage {
  num: number,
  power: number | null,
  duration: number | null,
  lactate: number | null
}

interface RampTest {
  stages: Array<RampTestStage>
}

const ramp_test: Ref<RampTest> = ref({ stages: [{ num: 1, power: null, duration: null, lactate: null }] })

function addStage() {
  const lastStage = ramp_test.value.stages[ramp_test.value.stages.length - 1];

  ramp_test.value.stages = [...ramp_test.value.stages, { num: lastStage!.num + 1, power: null, duration: lastStage!.duration, lactate: null }];
}

// watch(ramp_test, (newValue) => {
//   console.log(newValue.stages)
// }, { deep: true })

defineExpose(addStage)

function deleteStage() {
  // TODO
}

</script>

<template>
  <div>
    <Table>
      <TableCaption>
        Ramp Test Data Input
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>
            <h3 class='table-head'>Stage</h3>
          </TableHead>
          <TableHead>
            <h3 class='table-head'>Power (W)</h3>
          </TableHead>
          <TableHead>
            <h3 class='table-head'>Duration (s)</h3>
          </TableHead>
          <TableHead>
            <h3 class='table-head'>Lactate (mmol/L)</h3>
          </TableHead>
          <TableHead>
            <h3 class='table-head'>Action</h3>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="stage in ramp_test.stages" :key='stage.num'>
          <TableCell>
            <h3>{{ stage.num }}</h3>
          </TableCell>
          <TableCell><Input type="number" placeholder='Power' v-model.number='stage.power' /></TableCell>
          <TableCell><Input type="number" placeholder='Duration' v-model.number='stage.duration' /></TableCell>
          <TableCell><Input type="number" placeholder='Lactate' v-model.number='stage.lactate' /></TableCell>
          <TableCell><Button @click='deleteStage'>
              <XIcon class='text-red-400' />
            </Button></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<style lang="css" scoped>
.table-head {
  color: var(--color-text)
}
</style>
