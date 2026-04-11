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
import { XIcon } from 'lucide-vue-next';
import type { RampTest, RampTestStage } from '@/lib/models';

const props = defineProps<{
  modelValue: RampTest
}>()

const emit = defineEmits<{
  'update:modelValue': [data: RampTest]
}>()

function updateStageField(stageIndex: number, field: keyof RampTestStage, value: any) {
  const newStages = [...props.modelValue.stages];
  newStages[stageIndex] = { ...newStages[stageIndex], [field]: value };
  emit('update:modelValue', { stages: newStages });
}

function deleteStage(stageIndex: number) {
  const newStages = props.modelValue.stages.filter((_, index) => index !== stageIndex);
  emit('update:modelValue', { stages: newStages });
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
        <TableRow v-for="(stage, index) in props.modelValue.stages" :key='stage.num'>
          <TableCell>
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
          <TableCell><Button @click='deleteStage(index)'>
              <XIcon class='text-red-400' />
            </Button></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<style lang="css" scoped></style>
