<script setup lang="ts">
import { Card, CardContent, CardHeader } from './ui/card'
import { computed } from 'vue'
import type { RampTest } from '@/lib/models'

type Point = {
  num: number
  power: number
  lactate: number
}

type HeartRatePoint = {
  num: number
  power: number
  heart_rate: number
}

type Bounds = [number, number]

const props = defineProps<{
  ramp_test: RampTest
}>()

const points = computed<Point[]>(() =>
  props.ramp_test.stages
    .filter((stage) => stage.power !== null && stage.lactate !== null)
    .map((stage) => ({
      num: stage.num,
      power: stage.power as number,
      lactate: stage.lactate as number,
    }))
    .sort((a, b) => a.power - b.power),
)

const heartRatePoints = computed<HeartRatePoint[]>(() =>
  props.ramp_test.stages
    .filter((stage) => stage.power !== null && stage.heart_rate !== null)
    .map((stage) => ({
      num: stage.num,
      power: stage.power as number,
      heart_rate: stage.heart_rate as number,
    }))
    .sort((a, b) => a.power - b.power),
)

const allXValues = computed(() => [
  ...points.value.map((point) => point.power),
  ...heartRatePoints.value.map((point) => point.power),
])

const allYValues = computed(() => [
  ...points.value.map((point) => point.lactate),
  ...heartRatePoints.value.map((point) => point.heart_rate),
])

const chartWidth = 720
const chartHeight = 360
const margin = { top: 24, right: 24, bottom: 44, left: 56 }
const innerWidth = chartWidth - margin.left - margin.right
const innerHeight = chartHeight - margin.top - margin.bottom

const xDomain = computed<Bounds>(() => {
  if (!allXValues.value.length) {
    return [0, 100]
  }

  const min = Math.min(...allXValues.value)
  const max = Math.max(...allXValues.value)
  const padding = Math.max((max - min) * 0.08, 8)

  return [Math.max(0, min - padding), max + padding]
})

const yDomain = computed<Bounds>(() => {
  if (!allYValues.value.length) {
    return [0, 10]
  }

  const min = Math.min(...allYValues.value)
  const max = Math.max(...allYValues.value)
  const padding = Math.max((max - min) * 0.12, 0.5)

  return [Math.max(0, min - padding), max + padding]
})

const safeDomain = (min: number, max: number): Bounds => {
  if (max <= min) {
    return [min - 1, max + 1]
  }
  return [min, max]
}

const xScale = (value: number) => {
  const [xMin, xMax] = safeDomain(xDomain.value[0], xDomain.value[1])
  return margin.left + ((value - xMin) / (xMax - xMin)) * innerWidth
}

const yScale = (value: number) => {
  const [yMin, yMax] = safeDomain(yDomain.value[0], yDomain.value[1])
  return margin.top + innerHeight - ((value - yMin) / (yMax - yMin)) * innerHeight
}

const lactateLinePath = computed(() => {
  if (!points.value.length) {
    return ''
  }

  return points.value
    .map((point, index) => {
      const x = xScale(point.power)
      const y = yScale(point.lactate)
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
})

const heartRateLinePath = computed(() => {
  if (!heartRatePoints.value.length) {
    return ''
  }

  return heartRatePoints.value
    .map((point, index) => {
      const x = xScale(point.power)
      const y = yScale(point.heart_rate)
      return `${index === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
})

const xTicks = computed(() => {
  const [min, max] = safeDomain(xDomain.value[0], xDomain.value[1])
  const span = max - min
  const step = Math.max(1, Number((span / 5).toFixed(0)))
  const ticks: number[] = []

  for (let value = min; value <= max + 0.0001; value += step) {
    ticks.push(Number(value.toFixed(0)))
  }

  if (ticks.length === 0) {
    ticks.push(min, max)
  }

  return ticks
})

const yTicks = computed(() => {
  const [min, max] = safeDomain(yDomain.value[0], yDomain.value[1])
  const span = max - min
  const step = Number(Math.max(0.5, span / 5).toFixed(1))
  const ticks: number[] = []

  for (let value = min; value <= max + 0.0001; value += step) {
    ticks.push(Number(value.toFixed(1)))
  }

  if (ticks.length === 0) {
    ticks.push(min, max)
  }

  return ticks
})
</script>

<template>
  <Card>
    <CardHeader>
      <h2>Results Curve</h2>
    </CardHeader>
    <CardContent>
      <div class="data-curve">
        <svg viewBox="0 0 720 360" class="data-curve__svg" preserveAspectRatio="xMidYMid meet">
          <rect x="0" y="0" width="720" height="360" rx="18" fill="var(--card)" />

          <g class="grid-lines">
            <g v-for="value in yTicks" :key="`y-${value}`">
              <line :x1="margin.left" :x2="margin.left + innerWidth" :y1="yScale(value)" :y2="yScale(value)"
                class="grid-line" />
            </g>
            <g v-for="value in xTicks" :key="`x-${value}`">
              <line :x1="xScale(value)" :x2="xScale(value)" :y1="margin.top" :y2="margin.top + innerHeight"
                class="grid-line" />
            </g>
          </g>

          <path v-if="heartRateLinePath" :d="heartRateLinePath" class="data-curve__line data-curve__line--heart-rate" />
          <path v-if="lactateLinePath" :d="lactateLinePath" class="data-curve__line data-curve__line--lactate" />

          <g class="points">
            <g v-for="point in points" :key="point.num" class="data-curve__point-group">
              <circle :cx="xScale(point.power)" :cy="yScale(point.lactate)" r="5" class="data-curve__point" />
              <text :x="xScale(point.power) + 8" :y="yScale(point.lactate) - 8" class="data-curve__point-label">
                {{ point.num }}
              </text>
            </g>
          </g>

          <g :transform="`translate(${margin.left + innerWidth - 154}, ${margin.top + innerHeight - 70})`"
            class="data-curve__legend">
            <rect x="0" y="0" width="150" height="54" rx="12" class="data-curve__legend-background" />
            <g transform="translate(12, 18)">
              <circle cx="0" cy="0" r="5" class="data-curve__legend-marker data-curve__legend-marker--lactate" />
              <text x="14" y="4" class="data-curve__legend-label">Lactate</text>
            </g>
            <g transform="translate(12, 38)">
              <circle cx="0" cy="0" r="5" class="data-curve__legend-marker data-curve__legend-marker--heart-rate" />
              <text x="14" y="4" class="data-curve__legend-label">Heart Rate</text>
            </g>
          </g>

          <line :x1="margin.left" :y1="margin.top + innerHeight" :x2="margin.left + innerWidth"
            :y2="margin.top + innerHeight" class="axis" />
          <line :x1="margin.left" :y1="margin.top" :x2="margin.left" :y2="margin.top + innerHeight" class="axis" />

          <g class="ticks">
            <g v-for="value in xTicks" :key="`tick-x-${value}`">
              <line :x1="xScale(value)" :x2="xScale(value)" :y1="margin.top + innerHeight"
                :y2="margin.top + innerHeight + 6" class="tick" />
              <text :x="xScale(value)" :y="margin.top + innerHeight + 20" class="tick-label" text-anchor="middle">
                {{ value }}
              </text>
            </g>
            <g v-for="value in yTicks" :key="`tick-y-${value}`">
              <line :x1="margin.left - 6" :x2="margin.left" :y1="yScale(value)" :y2="yScale(value)" class="tick" />
              <text :x="margin.left - 10" :y="yScale(value) + 4" class="tick-label" text-anchor="end">
                {{ value }}
              </text>
            </g>
          </g>

          <text x="360" y="352" class="axis-label" text-anchor="middle">Power (W)</text>
          <text x="16" y="190" class="axis-label axis-label--vertical" text-anchor="middle">
            Lactate (mmol/L)
          </text>
        </svg>
      </div>
    </CardContent>
  </Card>
</template>

<style scoped>
.data-curve {
  width: 100%;
  min-height: 360px;
}

.data-curve__svg {
  width: 100%;
  height: auto;
  overflow: visible;
}

.grid-line {
  stroke: rgba(100, 116, 139, 0.18);
  stroke-width: 1;
}

.axis {
  stroke: var(--color-border);
  stroke-width: 1.5;
}

.tick {
  stroke: var(--color-border);
  stroke-width: 1;
}

.tick-label,
.axis-label,
.data-curve__point-label {
  fill: var(--foreground);
  font-size: 12px;
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}

.data-curve__line {
  fill: none;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.data-curve__line--lactate {
  stroke: var(--foreground);
}

.data-curve__line--heart-rate {
  stroke: #ef4444;
}

.data-curve__point {
  fill: var(--color-chart-2);
  stroke: var(--card-foreground);
  stroke-width: 1.5;
}

.data-curve__legend-background {
  fill: var(--card);
  stroke: var(--color-border);
  stroke-width: 1;
  opacity: 0.96;
}

.data-curve__legend-label,
.data-curve__point-label,
.axis-label,
.tick-label {
  fill: var(--foreground);
}

.data-curve__legend-label {
  font-size: 12px;
  font-weight: 600;
  dominant-baseline: middle;
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    sans-serif;
}

.data-curve__legend-marker--lactate {
  fill: var(--foreground);
}

.data-curve__legend-marker--heart-rate {
  fill: #ef4444;
}

.data-curve__point-label {
  font-weight: 700;
}

.axis-label {
  fill: var(--muted-foreground);
  font-size: 13px;
  opacity: 0.85;
}

.axis-label--vertical {
  transform: rotate(-90deg);
  transform-origin: 16px 190px;
}
</style>
