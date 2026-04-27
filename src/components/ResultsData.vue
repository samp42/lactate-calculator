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
import { ref, type Ref, computed } from 'vue'
import ResultsTable from './ResultsTable.vue'
import {
  type RampTest,
  type KeyMetrics,
  ThresholdCalculationMethods,
  ZoneModels,
} from '@/lib/models'
import { DownloadIcon } from 'lucide-vue-next'
import DataAnalysis from './DataAnalysis.vue'
import DataCurve from './DataCurve.vue'
import ZoneTable from './ZoneTable.vue'
import { calculateThresholds, calculateZones } from '@/lib/science'

const props = defineProps<{
  ramp_test: RampTest
}>()

function hasEnoughPoints(ramp_test: RampTest): boolean {
  // return true;

  return (
    ramp_test.stages.filter((stage) => stage.power !== null && stage.lactate !== null).length >= 4
  )
}

const key_metrics = computed<KeyMetrics>(() => {
  if (!hasEnoughPoints(props.ramp_test)) {
    return {
      athlete_name: null,
      athlete_weight: null,
      max_hr: null,
      thresholds: {
        method: null,
        lt1_power: null,
        lt1_heart_rate: null,
        lt2_power: null,
        lt2_heart_rate: null,
      },
      power_zones: [],
      heart_rate_zones: [],
    }
  }

  const thresholds = calculateThresholds(props.ramp_test, selected_method.value)
  const zones = calculateZones(props.ramp_test, thresholds, selected_zone_model.value)

  return {
    athlete_name: props.ramp_test.name,
    athlete_weight: props.ramp_test.weight,
    max_hr: Math.max(...props.ramp_test.stages.map((s) => s.heart_rate ?? 0)),
    thresholds,
    power_zones: zones.power_zones,
    heart_rate_zones: zones.heart_rate_zones,
  }
})

const selected_method: Ref<ThresholdCalculationMethods> = ref(ThresholdCalculationMethods.DMAX)
const selected_zone_model: Ref<ZoneModels> = ref(ZoneModels.FIVE_ZONES)
</script>

<template>
  <div v-if="hasEnoughPoints(ramp_test)">
    <div class="flex justify-between pb-1">
      <h2>Ramp Test Results</h2>
      <Button class="flex align-bottom">
        <DownloadIcon />
        <h3 class="pl-2">Download Results</h3>
      </Button>
    </div>
    <ResultsTable :ramp_test="ramp_test" class="pb-8" />

    <div class="pb-8">
      <div class="flex justify-between pb-1">
        <h2>Power & Lactate Curve</h2>
        <Select v-model="selected_method">
          <SelectTrigger class="w-60">
            <SelectValue placeholder="Select a calculation method" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Methods</SelectLabel>
              <SelectItem :value="ThresholdCalculationMethods.DMAX">
                {{ ThresholdCalculationMethods.DMAX }}
              </SelectItem>
              <SelectItem :value="ThresholdCalculationMethods.MODIFIED_DMAX">
                {{ ThresholdCalculationMethods.MODIFIED_DMAX }}
              </SelectItem>
              <SelectItem :value="ThresholdCalculationMethods.POLYNOMIAL_CURVE_FITTING">
                {{ ThresholdCalculationMethods.POLYNOMIAL_CURVE_FITTING }}
              </SelectItem>
              <SelectItem :value="ThresholdCalculationMethods.HR_LACTATE_COUPLING">
                {{ ThresholdCalculationMethods.HR_LACTATE_COUPLING }}
              </SelectItem>
              <SelectItem :value="ThresholdCalculationMethods.FIXED_LACTATE_THRESHOLDS">
                {{ ThresholdCalculationMethods.FIXED_LACTATE_THRESHOLDS }}
              </SelectItem>
              <SelectItem :value="ThresholdCalculationMethods.LOG_LOG_LT">
                {{ ThresholdCalculationMethods.LOG_LOG_LT }}
              </SelectItem>
              <SelectItem :value="ThresholdCalculationMethods.BASELINE_0_5">
                {{ ThresholdCalculationMethods.BASELINE_0_5 }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div class="mt-6">
        <DataCurve :ramp_test="ramp_test" />
      </div>
    </div>
    <div class="flex w-full justify-between pb-1">
      <h2>Zones</h2>
      <Select v-model="selected_zone_model">
        <SelectTrigger class="w-60">
          <SelectValue placeholder="Zone model" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Models</SelectLabel>
            <SelectItem :value="ZoneModels.THREE_ZONES">
              {{ ZoneModels.THREE_ZONES }}
            </SelectItem>
            <SelectItem :value="ZoneModels.FIVE_ZONES">
              {{ ZoneModels.FIVE_ZONES }}
            </SelectItem>
            <SelectItem :value="ZoneModels.SEVEN_ZONES">
              {{ ZoneModels.SEVEN_ZONES }}
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
    <div class="flex w-full justify-between pb-8">
      <ZoneTable type="power" :zones="key_metrics.power_zones" class="flex-1" />
      <div style="width: 12px"></div>
      <ZoneTable type="heart_rate" :zones="key_metrics.heart_rate_zones" class="flex-1" />
    </div>
    <h2>Calculated Data</h2>
    <DataAnalysis :key_metrics="key_metrics" />
  </div>
  <div v-else class="flex justify-center">
    <p class="font-black text-center" style="font-size: x-large; font-weight: bold">
      Not enough power & lactate points.<br />At least 4 are needed.
    </p>
  </div>
</template>
