<script setup lang="ts">

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
import { PlusIcon, XIcon } from 'lucide-vue-next';
import type { RampTest, RampTestStage } from '@/lib/models';

const props = defineProps<{
  modelValue: RampTest
}>()

const emit = defineEmits<{
  'update:modelValue': [data: RampTest],
}>()

function updateStageField(stageIndex: number, field: keyof RampTestStage, value: any) {
  const newStages = [...props.modelValue.stages];
  newStages[stageIndex] = { ...newStages[stageIndex], [field]: value };
  emit('update:modelValue', { name: props.modelValue.name, weight: props.modelValue.weight, stages: newStages });
}

function deleteStage(stageIndex: number) {
  const newStages = props.modelValue.stages.filter((_, index) => index !== stageIndex);
  emit('update:modelValue', { name: props.modelValue.name, weight: props.modelValue.weight, stages: newStages });
}

function addStage() {
  let newStages = [...props.modelValue.stages];
  if (newStages.length > 0) {
    const lastStage = newStages[newStages.length - 1];
    newStages = [...newStages, { num: lastStage.num + 1, power: null, duration: lastStage.duration, lactate: null, heart_rate: null }];
  } else {
    newStages = [{ num: 1, power: null, duration: null, lactate: null, heart_rate: null }];
  }
  emit('update:modelValue', { ...props.modelValue, stages: newStages });
}
</script>

<template>
  <div>
    <div class='flex justify-between pb-2'>
      <h2>Ramp Test Data</h2>
      <Button @click='addStage' class='flex'>
        <PlusIcon />
        <h3 class='pr-2'>Add Stage</h3>
      </Button>
    </div>
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
            <h3 class='table-head'>Heart Rate (BPM)</h3>
          </TableHead>
          <TableHead>
            <h3 class='table-head'>Action</h3>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(stage, index) in props.modelValue.stages" :key='stage.num'>
          <TableCell class='table-cell'>
            <h3>{{ stage.num }}</h3>
          </TableCell>
          <TableCell><Input type="number" placeholder='Power' :model-value="stage.power"
              @update:model-value="updateStageField(index, 'power', $event)" />
          </TableCell>
          <TableCell><Input type="number" placeholder='Duration' :model-value="stage.duration"
              @update:model-value="updateStageField(index, 'duration', $event)" />
          </TableCell>
          <TableCell><Input type="number" placeholder='Lactate' :model-value="stage.lactate"
              @update:model-value="updateStageField(index, 'lactate', $event)" />
          </TableCell>
          <TableCell><Input type="number" placeholder='Heart Rate' :model-value="stage.heart_rate"
              @update:model-value="updateStageField(index, 'heart_rate', $event)" />
          </TableCell>
          <TableCell class='table-cell'><Button @click='deleteStage(index)'>
              <XIcon class='text-red-400' />
            </Button></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<style lang="css" scoped></style>
