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
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { PlusIcon, XIcon, TrashIcon, UploadIcon } from 'lucide-vue-next'
import { ref } from 'vue'
import type { RampTest, RampTestStage } from '@/lib/models'
import { getFirstEmptyStage } from '@/lib/models'

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
  newStages[stageIndex] = { ...newStages[stageIndex]!, [field]: value }
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
    stages: getFirstEmptyStage(),
  })
}

const fileInput = ref<HTMLInputElement | null>(null)

function importCSV() {
  fileInput.value?.click()
}

function onFileSelected(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const text = e.target?.result as string
    const lines = text.trim().split('\n')
    if (lines.length < 2) return

    const headers = lines[0]!.split(',')
    const stages: RampTestStage[] = lines.slice(1).map((line) => {
      const values = line.split(',')
      const row: Record<string, string> = {}
      headers.forEach((h, i) => (row[h.trim()] = (values[i] ?? '').trim()))
      const parseNum = (v: string) => (v === '' ? null : Number(v))
      return {
        num: Number(row['num']),
        intensity: parseNum(row['intensity'] ?? ''),
        duration: parseNum(row['duration'] ?? ''),
        lactate: parseNum(row['lactate'] ?? ''),
        heart_rate: parseNum(row['heart_rate'] ?? ''),
      }
    })

    emit('update:modelValue', { ...props.modelValue, stages })
    // Reset so the same file can be re-imported
    if (fileInput.value) fileInput.value.value = ''
  }
  reader.readAsText(file)
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
      <RadioGroup
        :model-value="props.modelValue.sport"
        @update:model-value="(v) => updateAthleteSport(v as 'cycling' | 'running')"
        class="flex pl-4"
      >
        <div class="flex items-center space-x-2">
          <RadioGroupItem id="r1" value="cycling" />
          <Label for="r1" class="pl-2">Cycling</Label>
        </div>
        <div class="flex items-center space-x-2">
          <RadioGroupItem id="r2" value="running" />
          <Label for="r2" class="pl-2">Running</Label>
        </div>
      </RadioGroup>
      <div class="flex">
        <input ref="fileInput" type="file" accept=".csv" class="hidden" @change="onFileSelected" />
        <Button variant="outline" style="margin-right: 8px" @click="importCSV">
          <UploadIcon />
          <h3 class="pr-2">Import CSV</h3>
        </Button>
        <Button @click="clearTest" class="flex" variant="destructive" style="margin-right: 8px">
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
            <h3 class="table-head">
              {{ props.modelValue.sport === 'cycling' ? 'Power (W)' : 'Speed (km/h)' }}
            </h3>
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
          <TableCell
            ><Input
              type="number"
              :placeholder="props.modelValue.sport === 'cycling' ? 'Power' : 'Speed'"
              :model-value="stage.intensity ?? undefined"
              @update:model-value="updateStageField(index, 'intensity', $event)"
            />
          </TableCell>
          <TableCell
            ><Input
              type="number"
              placeholder="Duration"
              :model-value="stage.duration ?? undefined"
              @update:model-value="updateStageField(index, 'duration', $event)"
            />
          </TableCell>
          <TableCell
            ><Input
              type="number"
              placeholder="Lactate"
              :model-value="stage.lactate ?? undefined"
              @update:model-value="updateStageField(index, 'lactate', $event)"
            />
          </TableCell>
          <TableCell
            ><Input
              type="number"
              placeholder="Heart Rate"
              :model-value="stage.heart_rate ?? undefined"
              @update:model-value="updateStageField(index, 'heart_rate', $event)"
            />
          </TableCell>
          <TableCell class="table-cell">
            <Button @click="deleteStage(index)" variant="outline">
              <XIcon />
            </Button>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<style lang="css" scoped></style>
