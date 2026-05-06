<script setup lang="ts">
import { Card, CardContent, CardHeader } from './ui/card'
import {
  Table,
  TableCaption,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
} from './ui/table'
import type { TrainingZone } from '@/lib/models'
import { speedToPace } from '@/lib/science'

const props = defineProps<{
  type: 'power' | 'heart_rate'
  sport: 'cycling' | 'running'
  zones: Array<TrainingZone>
}>()

function formatPace(speed: number | null): string {
  if (speed === null || speed === 0) return '—'
  if (speed === Infinity) return '∞'
  const [min, sec] = speedToPace(speed)
  return `${min}:${String(sec).padStart(2, '0')}`
}
</script>

<template>
  <Card>
    <CardHeader>
      <h2>{{ props.type === 'power' ? (props.sport === 'running' ? 'Pace' : 'Power') : 'Heart Rate' }} Zones</h2>
    </CardHeader>
    <CardContent>
      <Table>
        <TableCaption>{{ props.type === 'power' ? (props.sport === 'running' ? 'Pace' : 'Power') : 'Heart Rate' }} Zones</TableCaption>
        <TableHeader>
          <TableHead>Zone</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Values</TableHead>
          <TableHead>Percent</TableHead>
        </TableHeader>
        <TableBody>
          <TableRow v-for="zone in zones" :key="zone.number">
            <TableCell>{{ zone.number }}</TableCell>
            <TableCell>{{ zone.description }}</TableCell>
            <TableCell v-if="props.type === 'power' && props.sport === 'running'">
              {{ formatPace(zone.max) }} - {{ formatPace(zone.min) }} /km
            </TableCell>
            <TableCell v-else>
              {{ zone.min }} - {{ zone.max === Infinity ? '∞' : zone.max }} {{ props.type === 'power' ? 'W' : 'BPM' }}
            </TableCell>
            <TableCell>{{ zone.min_percent }} - {{ zone.max_percent === Infinity ? '∞' : zone.max_percent }} %
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>
