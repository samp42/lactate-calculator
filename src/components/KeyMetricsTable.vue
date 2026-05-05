<script setup lang="ts">
import { Card, CardContent, CardHeader } from './ui/card'
import {
  Table,
  TableCaption,
  TableCell,
  TableRow,
  TableBody,
} from './ui/table'

import type { KeyMetrics } from '@/lib/models'

const props = defineProps<{
  sport: 'cycling' | 'running'
  key_metrics: KeyMetrics
}>()

function getPercentage(a: number | null, b: number | null): number | null {
  if (a && b) {
    return Math.round(a / b);
  }
  return null
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
          <TableRow v-if='props.key_metrics.athlete_weight'>
            <TableCell>
              <h3>Athlete Weight</h3>
            </TableCell>
            <TableCell class="table-cell">{{ props.key_metrics.athlete_weight }} kg</TableCell>
          </TableRow>
          <TableRow v-if='props.key_metrics.max_hr'>
            <TableCell>
              <h3>Max Heart Rate</h3>
            </TableCell>
            <TableCell class="table-cell">{{ props.key_metrics.max_hr }} BPM</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <h3>LT1 {{ props.sport === 'cycling' ? 'Power' : 'Speed' }}</h3>
            </TableCell>
            <TableCell class="table-cell">202 W - 1.2 mmol/L</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <h3>LT1 Heart Rate</h3>
            </TableCell>
            <TableCell class="table-cell">143 BPM - 77% of Max</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <h3>LT2 {{ props.sport === 'cycling' ? 'Power' : 'Speed' }}</h3>
            </TableCell>
            <TableCell class="table-cell">282 W - 4.6 mmol/L</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <h3>LT2 Heart Rate</h3>
            </TableCell>
            <TableCell class="table-cell">{{ props.key_metrics.thresholds.lt2_heart_rate }} BPM {{
              getPercentage(props.key_metrics.thresholds.lt2_heart_rate, props.key_metrics.max_hr) ? '-' +
                getPercentage(props.key_metrics.thresholds.lt2_heart_rate, props.key_metrics.max_hr) + '%' : '' }}
            </TableCell>
          </TableRow>
          <div class='contents' v-if="props.sport === 'cycling'">
            <TableRow v-if='props.key_metrics.ppo'>
              <TableCell>
                <h3>Peak One-Minute Power</h3>
              </TableCell>
              <TableCell class="table-cell">{{ props.key_metrics.ppo }} W</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <h3>Functional Threshold Power</h3>
              </TableCell>
              <TableCell class="table-cell">280 W</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <h3>Maximal Aerobic Power</h3>
              </TableCell>
              <TableCell class="table-cell">343 W</TableCell>
            </TableRow>
            <TableRow v-if='!!props.key_metrics.vo2_max_absolute'>
              <TableCell>
                <h3>VO2 Max (Absolute)</h3>
              </TableCell>
              <TableCell class="table-cell">{{ Math.round(props.key_metrics.vo2_max_absolute * 100) / 100 }} L/min
              </TableCell>
            </TableRow>
            <TableRow v-if='props.key_metrics.vo2_max_relative'>
              <TableCell>
                <h3>VO2 Max (Relative)</h3>
              </TableCell>
              <TableCell class="table-cell">{{ Math.round(props.key_metrics.vo2_max_relative * 100) / 100 }} ml/kg/min
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <h3>Fatmax Power</h3>
              </TableCell>
              <TableCell class="table-cell">192 W - 56% of MAP</TableCell>
            </TableRow>
          </div>
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
