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

const power_zones: Array<TrainingZone> = [
  { number: 1, description: 'easy', min: null, max: 160, min_percent: null, max_percent: 55 },
]
</script>

<template>
  <Card>
    <CardHeader>
      <h2>Power Zones</h2>
    </CardHeader>
    <CardContent>
      <Table>
        <TableCaption>Power Zones</TableCaption>
        <TableHeader>
          <TableHead>Zone</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Values</TableHead>
          <TableHead>Percent</TableHead>
        </TableHeader>
        <TableBody>
          <TableRow v-for="zone in power_zones" :key="zone.number">
            <TableCell>{{ zone.number }}</TableCell>
            <TableCell>{{ zone.description }}</TableCell>
            <TableCell>{{ zone.min }} - {{ zone.max }}</TableCell>
            <TableCell>{{ zone.min_percent }} - {{ zone.max_percent }}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </CardContent>
  </Card>
</template>
