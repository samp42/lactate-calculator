<template>
  <div class="rounded-3xl border border-slate-200/80 bg-white/80 p-4 shadow-sm">
    <div ref="plotDiv" class="w-full min-h-95" />
  </div>
</template>

<script setup lang="ts">
import type { KeyMetrics, RampTest } from '@/lib/models'
import { computed, onMounted, ref, watch } from 'vue'
import Plotly from 'plotly.js-dist-min'

const props = defineProps<{
  ramp_test: RampTest
  key_metrics: KeyMetrics
}>()

const plotDiv = ref<HTMLDivElement | null>(null)

const sortedStages = computed(() => {
  return [...props.ramp_test.stages]
    .filter((stage) => stage.intensity !== null)
    .sort((a, b) => (a.intensity ?? 0) - (b.intensity ?? 0))
})

const ltLines = computed(() => {
  const shapes: Array<Record<string, unknown>> = []
  const annotations: Array<Record<string, unknown>> = []

  if (props.key_metrics.thresholds.lt1_intensity !== null) {
    shapes.push({
      type: 'line',
      x0: props.key_metrics.thresholds.lt1_intensity,
      x1: props.key_metrics.thresholds.lt1_intensity,
      y0: 0,
      y1: 1,
      yref: 'paper',
      line: { color: '#10b981', width: 2, dash: 'dash' },
    })
    annotations.push({
      x: props.key_metrics.thresholds.lt1_intensity,
      y: 1.08,
      xref: 'x',
      yref: 'paper',
      text: 'LT1',
      showarrow: false,
      font: { color: '#10b981', size: 13 },
    })
  }

  if (props.key_metrics.thresholds.lt2_intensity !== null) {
    shapes.push({
      type: 'line',
      x0: props.key_metrics.thresholds.lt2_intensity,
      x1: props.key_metrics.thresholds.lt2_intensity,
      y0: 0,
      y1: 1,
      yref: 'paper',
      line: { color: '#f59e0b', width: 2, dash: 'dashdot' },
    })
    annotations.push({
      x: props.key_metrics.thresholds.lt2_intensity,
      y: 1.08,
      xref: 'x',
      yref: 'paper',
      text: 'LT2',
      showarrow: false,
      font: { color: '#f59e0b', size: 13 },
    })
  }

  return { shapes, annotations }
})

const renderPlot = () => {
  if (!plotDiv.value) {
    return
  }

  const powerValues = sortedStages.value.map((stage) => stage.intensity as number)
  const lactateValues = sortedStages.value.map((stage) => stage.lactate ?? null)
  const hrValues = sortedStages.value.map((stage) => stage.heart_rate ?? null)

  const traces = [
    {
      x: powerValues,
      y: lactateValues,
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Lactate',
      line: { shape: 'spline', color: '#2563eb', width: 3 },
      marker: { size: 8, color: '#2563eb' },
      hovertemplate: 'Power: %{x} W<br>Lactate: %{y} mmol/L<extra></extra>',
    },
    {
      x: powerValues,
      y: hrValues,
      type: 'scatter',
      mode: 'lines+markers',
      name: 'Heart Rate',
      yaxis: 'y2',
      line: { shape: 'spline', dash: 'dot', color: '#ef4444', width: 3 },
      marker: { size: 8, color: '#ef4444' },
      hovertemplate: 'Power: %{x} W<br>Heart Rate: %{y} bpm<extra></extra>',
    },
  ]

  const layout = {
    title: 'Lactate and Heart Rate vs Power/Speed',
    xaxis: {
      title: 'Power (W)',
      zeroline: false,
      showgrid: true,
      gridcolor: '#e2e8f0',
    },
    yaxis: {
      title: 'Lactate (mmol/L)',
      zeroline: false,
      showgrid: true,
      gridcolor: '#e2e8f0',
    },
    yaxis2: {
      title: 'Heart Rate (BPM)',
      overlaying: 'y',
      side: 'right',
      zeroline: false,
      showgrid: false,
    },
    legend: { orientation: 'h', y: -0.2, x: 0, xanchor: 'left' },
    margin: { l: 60, r: 70, t: 60, b: 60 },
    hovermode: 'x unified',
    shapes: ltLines.value.shapes,
    annotations: ltLines.value.annotations,
    template: 'plotly_white',
  }

  Plotly.react(plotDiv.value, traces, layout, { responsive: true })
}

onMounted(renderPlot)

watch(() => [props.ramp_test.stages, props.key_metrics.thresholds], renderPlot, { deep: true })
</script>
