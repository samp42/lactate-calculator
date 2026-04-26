<script setup lang="ts">
import { Button } from './ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ref, type Ref } from 'vue'
import ResultsTable from './ResultsTable.vue'
import { type RampTest, type KeyMetrics, ZoneCalculationMethods } from '@/lib/models'
import { DownloadIcon } from 'lucide-vue-next'
import DataAnalysis from './DataAnalysis.vue'
import ZoneTable from './ZoneTable.vue'

const props = defineProps<{
  ramp_test: RampTest
}>()

function hasEnoughPoints(ramp_test: RampTest): boolean {
  // return true;

  return ramp_test.stages.filter(stage => stage.power !== null && stage.lactate !== null).length >= 4
}

const key_metrics: Ref<KeyMetrics> = ref({})

const selected_method: Ref<ZoneCalculationMethods> = ref(ZoneCalculationMethods.DMAX)
</script>

<template>
  <div v-if='hasEnoughPoints(ramp_test)'>
    <div class="flex justify-between pb-1">
      <h2>Ramp Test Results</h2>
      <Button class="flex align-bottom">
        <DownloadIcon />
        <h3 class="pl-2">Download Results</h3>
      </Button>
    </div>
    <ResultsTable :ramp_test="ramp_test" class='pb-8' />

    <div class='pb-8'>
      <h2>Power & Lactate Curve</h2>
      <Select>
        <SelectTrigger class="w-60">
          <SelectValue placeholder="Select a calculation method" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Methods</SelectLabel>
            <SelectItem :value="ZoneCalculationMethods.DMAX">
              {{ ZoneCalculationMethods.DMAX }}
            </SelectItem>
            <SelectItem :value="ZoneCalculationMethods.MODIFIED_DMAX">
              {{ ZoneCalculationMethods.MODIFIED_DMAX }}
            </SelectItem>
            <SelectItem :value="ZoneCalculationMethods.POLYNOMIAL_CURVE_FITTING">
              {{ ZoneCalculationMethods.POLYNOMIAL_CURVE_FITTING }}
            </SelectItem>
            <SelectItem :value="ZoneCalculationMethods.HR_LACTATE_COUPLING">
              {{ ZoneCalculationMethods.HR_LACTATE_COUPLING }}
            </SelectItem>
            <SelectItem :value="ZoneCalculationMethods.FIXED_LACTATE_THRESHOLDS">
              {{ ZoneCalculationMethods.FIXED_LACTATE_THRESHOLDS }}
            </SelectItem>
            <SelectItem :value="ZoneCalculationMethods.LOG_LOG_LT">
              {{ ZoneCalculationMethods.LOG_LOG_LT }}
            </SelectItem>
            <SelectItem :value="ZoneCalculationMethods.BASELINE_0_5">
              {{ ZoneCalculationMethods.BASELINE_0_5 }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
    <h2>Zones</h2>
    <div class="flex w-full justify-between pb-8">
      <ZoneTable />
      <ZoneTable />
    </div>
    <h2>Calculated Data</h2>
    <DataAnalysis :key_metrics="key_metrics" />
  </div>
  <div v-else class='flex justify-center'>
    <p class='font-black text-center' style='font-size: x-large; font-weight: bold;'>Not enough power & lactate
      points.<br />At least 4 are
      needed.</p>
  </div>
</template>
