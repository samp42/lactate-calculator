<script setup lang="ts">
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ref, type Ref } from 'vue';
import ResultsTable from './ResultsTable.vue';
import { type RampTest, type KeyMetrics, ZoneCalculationMethods } from '@/lib/models';
import { DownloadIcon } from 'lucide-vue-next';
import DataAnalysis from './DataAnalysis.vue';
import ZoneTable from './ZoneTable.vue'

const props = defineProps<{
  ramp_test: RampTest
}>();

const key_metrics: Ref<KeyMetrics> = ref({});

const selected_method: Ref<ZoneCalculationMethods> = ref(ZoneCalculationMethods.DMAX)
</script>

<template>
  <div class='flex justify-between'>
    <h2>Ramp Test Power</h2>
    <Button class='flex align-bottom'>
      <DownloadIcon />
      <h3 class='pl-2'>Download Results</h3>
    </Button>
  </div>
  <ResultsTable :ramp_test="ramp_test" />

  <div>
    <h2>Power & Lactate Curve</h2>
    <Select>
      <SelectTrigger class="w-60">
        <SelectValue placeholder="Select a calculation method" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Methods</SelectLabel>
          <SelectItem :value='ZoneCalculationMethods.DMAX'>
            {{ ZoneCalculationMethods.DMAX }}
          </SelectItem>
          <SelectItem :value='ZoneCalculationMethods.MODIFIED_DMAX'>
            {{ ZoneCalculationMethods.MODIFIED_DMAX }}
          </SelectItem>
          <SelectItem :value='ZoneCalculationMethods.POLYNOMIAL_CURVE_FITTING'>
            {{ ZoneCalculationMethods.POLYNOMIAL_CURVE_FITTING }}
          </SelectItem>
          <SelectItem :value='ZoneCalculationMethods.HR_LACTATE_COUPLING'>
            {{ ZoneCalculationMethods.HR_LACTATE_COUPLING }}
          </SelectItem>
          <SelectItem :value='ZoneCalculationMethods.FIXED_LACTATE_THRESHOLDS'>
            {{ ZoneCalculationMethods.FIXED_LACTATE_THRESHOLDS }}
          </SelectItem>
          <SelectItem :value='ZoneCalculationMethods.LOG_LOG_LT'>
            {{ ZoneCalculationMethods.LOG_LOG_LT }}
          </SelectItem>
          <SelectItem :value='ZoneCalculationMethods.BASELINE_0_5'>
            {{ ZoneCalculationMethods.BASELINE_0_5 }}
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>
  <h2>Zones</h2>
  <div class='flex'>
    <ZoneTable />
    <ZoneTable />
  </div>
  <h2>Calculated Data</h2>
  <DataAnalysis :key_metrics="key_metrics" />
</template>
