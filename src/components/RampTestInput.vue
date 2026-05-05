<script setup lang="ts">
import {
  Table,
  TableCaption,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
} from './ui/table'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { PlusIcon, XIcon, TrashIcon } from 'lucide-vue-next'
import type { RampTest, RampTestStage } from '@/lib/models'
import { getFirstEmptyStage } from '@/lib/models';

const props = defineProps<{
  modelValue: RampTest
}>()

const emit = defineEmits<{
  'update:modelValue': [data: RampTest]
}>()

function updateAthleteSport(newSport: 'cycling' | 'running') {
  emit('update:modelValue', {
    name: props.modelValue.name,
    weight: props.modelValue.weight,
    sport: newSport,
    stages: props.modelValue.stages,
  })
}

function updateStageField(stageIndex: number, field: keyof RampTestStage, value: any) {
  const newStages = [...props.modelValue.stages]
  newStages[stageIndex] = { ...newStages[stageIndex], [field]: value }
  emit('update:modelValue', {
    name: props.modelValue.name,
    weight: props.modelValue.weight,
    sport: props.modelValue.sport,
    stages: newStages,
  })
}

function deleteStage(stageIndex: number) {
  const newStages = props.modelValue.stages.filter((_, index) => index !== stageIndex)
  emit('update:modelValue', {
    name: props.modelValue.name,
    weight: props.modelValue.weight,
    sport: props.modelValue.sport,
    stages: newStages,
  })
}

function clearTest() {
  emit('update:modelValue', {
    name: null,
    weight: null,
    sport: 'cycling',
    stages: getFirstEmptyStage()
  })
}

function addStage() {
  let newStages = [...props.modelValue.stages]
  if (newStages.length > 0) {
    const lastStage = newStages[newStages.length - 1]
    newStages = [
      ...newStages,
      {
        num: lastStage!.num + 1,
        intensity: null,
        duration: lastStage!.duration,
        lactate: null,
        heart_rate: null,
      },
    ]
  } else {
    newStages = getFirstEmptyStage()
  }
  emit('update:modelValue', { ...props.modelValue, stages: newStages })
}
</script>

<template>
  <div>
    <h2>Ramp Test Data</h2>
    <div class="flex justify-between pb-2">

      <RadioGroup :model-value="props.modelValue.sport" @update:model-value="updateAthleteSport" class='flex pl-4'>
        <div class="flex items-center space-x-2">
          <RadioGroupItem id="r1" value="cycling" />
          <Label for="r1" class='pl-2'>Cycling</Label>
        </div>
        <div class="flex items-center space-x-2">
          <RadioGroupItem id="r2" value="running" />
          <Label for="r2" class='pl-2'>Running</Label>
        </div>
      </RadioGroup>
      <div class='flex'>
        <Button @click="clearTest" class="flex" variant='destructive' style='margin-right: 8px;'>
          <TrashIcon />
          <h3 class="pr-2">Clear All</h3>
        </Button>
        <Button @click="addStage" class="flex">
          <PlusIcon />
          <h3 class="pr-2">Add Stage</h3>
        </Button>
      </div>
    </div>
    <Table>
      <TableCaption> Ramp Test Data Input </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>
            <h3 class="table-head">Stage</h3>
          </TableHead>
          <TableHead>
            <h3 class="table-head">{{ props.modelValue.sport === 'cycling' ? 'Power (W)' : 'Speed (km/h)' }}</h3>
          </TableHead>
          <TableHead>
            <h3 class="table-head">Duration (s)</h3>
          </TableHead>
          <TableHead>
            <h3 class="table-head">Lactate (mmol/L)</h3>
          </TableHead>
          <TableHead>
            <h3 class="table-head">Heart Rate (BPM)</h3>
          </TableHead>
          <TableHead>
            <h3 class="table-head">Action</h3>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="(stage, index) in props.modelValue.stages" :key="stage.num">
          <TableCell class="table-cell">
            <h3>{{ stage.num }}</h3>
          </TableCell>
          <TableCell><Input type="number" :placeholder="props.modelValue.sport === 'cycling' ? 'Power' : 'Speed'"
              :model-value="stage.intensity" @update:model-value="updateStageField(index, 'intensity', $event)" />
          </TableCell>
          <TableCell><Input type="number" placeholder="Duration" :model-value="stage.duration"
              @update:model-value="updateStageField(index, 'duration', $event)" />
          </TableCell>
          <TableCell><Input type="number" placeholder="Lactate" :model-value="stage.lactate"
              @update:model-value="updateStageField(index, 'lactate', $event)" />
          </TableCell>
          <TableCell><Input type="number" placeholder="Heart Rate" :model-value="stage.heart_rate"
              @update:model-value="updateStageField(index, 'heart_rate', $event)" />
          </TableCell>
          <TableCell class="table-cell">
            <Button @click="deleteStage(index)" variant='outline'>
              <XIcon />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<style lang="css" scoped></style>
