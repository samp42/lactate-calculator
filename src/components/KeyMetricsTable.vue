<script setup lang="ts">
import { Card, CardContent, CardHeader } from './ui/card'
import { Table, TableCaption, TableCell, TableRow, TableBody } from './ui/table'

import type { KeyMetrics } from '@/lib/models'
import { speedToPace } from '@/lib/science'

const props = defineProps<{
  sport: 'cycling' | 'running'
  key_metrics: KeyMetrics
}>()

function getPercentage(a: number | null, b: number | null): number | null {
  if (a && b) {
    return Math.round((a * 100) / b)
  }
  return null
}

function formatIntensity(intensity: number | null): string {
  if (intensity == null) return '—'
  if (props.sport === 'running') {
    const [min, sec] = speedToPace(intensity)
    return `${min}:${String(sec).padStart(2, '0')} /km`
  }
  return `${Math.round(intensity)} W`
}
</script>

<template>
  <Card>
    <CardHeader>
      <h2>Key Metrics</h2>
    </CardHeader>
    <CardContent>
      <Table class="px-3">
        <TableCaption>Key Metrics</TableCaption>
        <!-- <TableHeader>
          <TableRow>
            <TableHead>
              <h3 class='table-head'>Metric</h3>
            </TableHead>
            <TableHead>
              <h3 class='table-head'>Value</h3>
            </TableHead>
          </TableRow>
        </TableHeader> -->
        <TableBody>
          <TableRow v-if="props.key_metrics.athlete_weight">
            <TableCell>
              <h3>Athlete Weight</h3>
            </TableCell>
            <TableCell class="table-cell">{{ props.key_metrics.athlete_weight }} kg</TableCell>
          </TableRow>
          <TableRow v-if="props.key_metrics.max_hr">
            <TableCell>
              <h3>Max Heart Rate</h3>
            </TableCell>
            <TableCell class="table-cell">{{ props.key_metrics.max_hr }} BPM</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <h3>LT1 {{ props.sport === 'cycling' ? 'Power' : 'Pace' }}</h3>
            </TableCell>
            <TableCell class="table-cell">{{
              formatIntensity(props.key_metrics.thresholds.lt1_intensity)
            }}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <h3>LT1 Heart Rate</h3>
            </TableCell>
            <TableCell class="table-cell"
              >{{
                props.key_metrics.thresholds.lt1_heart_rate != null
                  ? Math.round(props.key_metrics.thresholds.lt1_heart_rate) + ' BPM'
                  : '—'
              }}{{
                getPercentage(props.key_metrics.thresholds.lt1_heart_rate, props.key_metrics.max_hr)
                  ? ' - ' +
                    getPercentage(
                      props.key_metrics.thresholds.lt1_heart_rate,
                      props.key_metrics.max_hr,
                    ) +
                    '%'
                  : ''
              }}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <h3>LT2 {{ props.sport === 'cycling' ? 'Power' : 'Pace' }}</h3>
            </TableCell>
            <TableCell class="table-cell">{{
              formatIntensity(props.key_metrics.thresholds.lt2_intensity)
            }}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <h3>LT2 Heart Rate</h3>
            </TableCell>
            <TableCell class="table-cell"
              >{{
                props.key_metrics.thresholds.lt2_heart_rate != null
                  ? Math.round(props.key_metrics.thresholds.lt2_heart_rate) + ' BPM'
                  : '—'
              }}{{
                getPercentage(props.key_metrics.thresholds.lt2_heart_rate, props.key_metrics.max_hr)
                  ? ' - ' +
                    getPercentage(
                      props.key_metrics.thresholds.lt2_heart_rate,
                      props.key_metrics.max_hr,
                    ) +
                    '%'
                  : ''
              }}
            </TableCell>
          </TableRow>
          <template v-if="props.sport === 'cycling'">
            <!-- <TableRow v-if="props.key_metrics.ppo">
              <TableCell>
                <h3>Peak One-Minute Power</h3>
              </TableCell>
              <TableCell class="table-cell">{{ props.key_metrics.ppo }} W</TableCell>
            </TableRow> -->
            <!-- <TableRow v-if="props.key_metrics.ftp">
              <TableCell>
                <h3>Functional Threshold Power</h3>
              </TableCell>
              <TableCell class="table-cell">{{ props.key_metrics.ftp }} W</TableCell>
            </TableRow> -->
            <TableRow v-if="props.key_metrics.map != null">
              <TableCell>
                <h3>Maximal Aerobic Power</h3>
              </TableCell>
              <TableCell class="table-cell">{{ formatIntensity(props.key_metrics.map) }}</TableCell>
            </TableRow>
            <!-- <TableRow>
              <TableCell>
                <h3>Fatmax Power</h3>
              </TableCell>
              <TableCell class="table-cell">192 W - 56% of MAP</TableCell>
            </TableRow> -->
          </template>
          <TableRow v-if="props.key_metrics.vo2_max_relative != null">
            <TableCell>
              <h3>VO2 Max (Relative)</h3>
            </TableCell>
            <TableCell class="table-cell"
              >{{ props.key_metrics.vo2_max_relative }} mL/kg/min</TableCell
            >
          </TableRow>
          <TableRow v-if="props.key_metrics.vo2_max_absolute != null">
            <TableCell>
              <h3>VO2 Max (Absolute)</h3>
            </TableCell>
            <TableCell class="table-cell">{{ props.key_metrics.vo2_max_absolute }} L/min</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <h3>Lactate Treshold Calculation Method</h3>
            </TableCell>
            <TableCell class="table-cell">{{ props.key_metrics.thresholds.method }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>
