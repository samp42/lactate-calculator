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
import { ref, type Ref, computed, watch, nextTick } from 'vue'
import ResultsTable from './ResultsTable.vue'
import { type RampTest, type KeyMetrics, ThresholdCalculationMethods } from '@/lib/models'
import { DownloadIcon } from 'lucide-vue-next'
import KeyMetricsTable from './KeyMetricsTable.vue'
import DataPlot from './DataPlot.vue'
import ZoneTable from './ZoneTable.vue'
import {
  calculateThresholds,
  calculateZones,
  calculateMAP,
  calculateVO2Max,
  calculateFTP,
} from '@/lib/science'
import html2canvas from 'html2canvas-pro'
import { PDFDocument, rgb } from 'pdf-lib'

const props = defineProps<{
  ramp_test: RampTest
}>()

function hasEnoughPoints(ramp_test: RampTest): boolean {
  // return true;

  return (
    ramp_test.stages.filter((stage) => stage.intensity !== null && stage.lactate !== null).length >=
    4
  )
}

const key_metrics = computed<KeyMetrics>(() => {
  if (!hasEnoughPoints(props.ramp_test)) {
    return {
      athlete_name: props.ramp_test.name,
      athlete_weight: props.ramp_test.weight,
      max_hr:
        props.ramp_test.stages.length > 0
          ? Math.max(...props.ramp_test.stages.map((s) => s.heart_rate ?? 0))
          : null,
      ftp: null,
      map: null,
      ppo: null,
      vo2_max_absolute: null,
      vo2_max_relative: null,
      thresholds: {
        method: null,
        lt1_intensity: null,
        lt1_heart_rate: null,
        lt2_intensity: null,
        lt2_heart_rate: null,
      },
      power_zones: [],
      heart_rate_zones: [],
    }
  }

  const thresholds = calculateThresholds(props.ramp_test, selected_method.value)
  const zones = calculateZones(props.ramp_test, thresholds)

  const map = calculateMAP(props.ramp_test)
  const vo2_max = calculateVO2Max(props.ramp_test, map)

  watch(key_metrics, () => {
    console.log(thresholds)
  })

  return {
    athlete_name: props.ramp_test.name,
    athlete_weight: props.ramp_test.weight,
    max_hr: Math.max(...props.ramp_test.stages.map((s) => s.heart_rate ?? 0)),
    ftp: calculateFTP(props.ramp_test),
    map: map,
    ppo: null,
    vo2_max_absolute: vo2_max?.absolute ?? null,
    vo2_max_relative: vo2_max?.relative ?? null,
    thresholds,
    power_zones: zones.intensity_zones,
    heart_rate_zones: zones.heart_rate_zones,
  }
})

const selected_method: Ref<ThresholdCalculationMethods> = ref(ThresholdCalculationMethods.DMAX)

const resultsContainer = ref<HTMLElement | null>(null)
const isDownloading = ref(false)

async function downloadPDF() {
  if (!resultsContainer.value) return
  isDownloading.value = true

  try {
    await nextTick()

    const excluded = Array.from(document.querySelectorAll<HTMLElement>('.pdf-exclude'))
    excluded.forEach((el) => (el.style.visibility = 'hidden'))

    const canvas = await html2canvas(resultsContainer.value, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    })

    excluded.forEach((el) => (el.style.visibility = ''))

    const jpegBytes = await new Promise<ArrayBuffer>((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? b.arrayBuffer().then(resolve) : reject(new Error('toBlob failed'))),
        'image/jpeg',
        0.95,
      ),
    )

    const pdfDoc = await PDFDocument.create()
    const jpegImage = await pdfDoc.embedJpg(jpegBytes)
    const pageW = canvas.width / 2
    const pageH = canvas.height / 2
    const page = pdfDoc.addPage([pageW, pageH])
    page.drawImage(jpegImage, { x: 0, y: 0, width: pageW, height: pageH })
    page.drawRectangle({
      x: 0,
      y: 0,
      width: pageW,
      height: pageH,
      borderColor: rgb(0, 0, 0),
      borderWidth: 1,
      color: undefined,
    })

    const name = props.ramp_test.name?.toUpperCase().replace(/\s+/g, '_')
    const date = new Date().toISOString().slice(0, 10)
    const filename = name ? `${name}_ramp_test_${date}.pdf` : `$ramp_test_${date}.pdf`

    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  } catch (e) {
    console.error('PDF download failed:', e)
  } finally {
    isDownloading.value = false
  }
}
</script>

<template>
  <div v-if="hasEnoughPoints(ramp_test)">
    <div class="flex justify-between pb-1">
      <h2>Ramp Test Results</h2>
      <Button
        class="flex align-bottom"
        variant="outline"
        :disabled="isDownloading"
        @click="downloadPDF"
      >
        <DownloadIcon />
        <h3 class="pl-2">{{ isDownloading ? 'Downloading...' : 'Download Results' }}</h3>
      </Button>
    </div>
    <div ref="resultsContainer">
      <ResultsTable :ramp_test="ramp_test" class="pb-8" />

      <div class="pb-8">
        <div class="flex justify-between pb-1">
          <h2>Results Curve</h2>
          <Select v-model="selected_method">
            <SelectTrigger class="w-60">
              <SelectValue placeholder="Select a calculation method" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Methods</SelectLabel>
                <!-- <SelectItem :value="ThresholdCalculationMethods.NONE">
                {{ ThresholdCalculationMethods.NONE }}
              </SelectItem> -->
                <SelectItem :value="ThresholdCalculationMethods.DMAX">
                  {{ ThresholdCalculationMethods.DMAX }}
                </SelectItem>
                <SelectItem :value="ThresholdCalculationMethods.MODIFIED_DMAX">
                  {{ ThresholdCalculationMethods.MODIFIED_DMAX }}
                </SelectItem>
                <SelectItem :value="ThresholdCalculationMethods.LOG_LOG_DMAX">
                  {{ ThresholdCalculationMethods.LOG_LOG_DMAX }}
                </SelectItem>
                <!-- <SelectItem :value="ThresholdCalculationMethods.POLYNOMIAL_CURVE_FITTING">
                {{ ThresholdCalculationMethods.POLYNOMIAL_CURVE_FITTING }}
              </SelectItem> -->

                <SelectItem :value="ThresholdCalculationMethods.HR_LACTATE_COUPLING">
                  {{ ThresholdCalculationMethods.HR_LACTATE_COUPLING }}
                </SelectItem>
                <SelectItem :value="ThresholdCalculationMethods.FIXED_LACTATE_THRESHOLDS">
                  {{ ThresholdCalculationMethods.FIXED_LACTATE_THRESHOLDS }}
                </SelectItem>
                <!-- <SelectItem :value="ThresholdCalculationMethods.LOG_LOG_LT">
                {{ ThresholdCalculationMethods.LOG_LOG_LT }}
              </SelectItem>
              <SelectItem :value="ThresholdCalculationMethods.BASELINE_0_5">
                {{ ThresholdCalculationMethods.BASELINE_0_5 }}
              </SelectItem> -->
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div class="mt-6">
          <!-- <DataCurve :ramp_test="ramp_test" /> -->
          <DataPlot :ramp_test="ramp_test" :key_metrics="key_metrics" />
        </div>
      </div>
      <div class="flex w-full justify-between pb-1">
        <h2>Zones</h2>
      </div>
      <div class="pb-8">
        <ZoneTable
          type="power"
          v-if="ramp_test.sport === 'cycling'"
          :sport="ramp_test.sport"
          :zones="key_metrics.power_zones"
          class="flex-1"
        />
        <div style="height: 12px"></div>
        <ZoneTable
          type="heart_rate"
          :sport="ramp_test.sport"
          :zones="key_metrics.heart_rate_zones"
          class="flex-1"
        />
      </div>

      <h2>Calculated Data</h2>
      <KeyMetricsTable :sport="ramp_test.sport" :key_metrics="key_metrics" />
    </div>
  </div>
  <div v-else class="flex justify-center">
    <p class="font-black text-center" style="font-size: x-large; font-weight: bold">
      Not enough {{ ramp_test.sport === 'cycling' ? 'power' : 'speed' }} & lactate points.<br />At
      least 4 are needed.
    </p>
  </div>
</template>
