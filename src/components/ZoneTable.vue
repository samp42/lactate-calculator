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

const props = defineProps<{
  type: 'power' | 'heart_rate'
  zones: Array<TrainingZone>
}>()
</script>

<template>
  <Card>
    <CardHeader>
      <h2>{{ props.type === 'power' ? 'Power' : 'Heart Rate' }} Zones</h2>
    </CardHeader>
    <CardContent>
      <Table>
        <TableCaption>{{ props.type === 'power' ? 'Power' : 'Heart Rate' }} Zones</TableCaption>
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
            <TableCell>{{ zone.min }} - {{ zone.max === Infinity ? '∞' : zone.max }} {{ props.type === 'power' ? 'W' :
              'BPM' }}</TableCell>
            <TableCell>{{ zone.min_percent }} - {{ zone.max_percent === Infinity ? '∞' : zone.max_percent }} %
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>
