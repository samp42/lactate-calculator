<script setup lang="ts">
import {
  Table,
  TableCaption,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
} from './ui/table';
import type { RampTest } from '@/lib/models';

const props = defineProps<{
  ramp_test: RampTest
}>();
</script>

<template>
  <div>
    <Table>
      <TableCaption>Ramp Test Results {{ props.ramp_test.name !== null ? 'for ' + props.ramp_test.name : '' }}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>
            <h3 class='table-head'>Stage</h3>
          </TableHead>
          <TableHead>
            <h3 class='table-head'>Power (W)</h3>
          </TableHead>
          <TableHead>
            <h3 class='table-head'>Duration (s)</h3>
          </TableHead>
          <TableHead>
            <h3 class='table-head'>Lactate (mmol/L)</h3>
          </TableHead>
          <TableHead>
            <h3 class='table-head'>Heart Rate (BPM)</h3>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="stage in props.ramp_test.stages" :key="stage.num">
          <TableCell class='table-cell'>{{ stage.num }}</TableCell>
          <TableCell class='table-cell'>{{ stage.power }}</TableCell>
          <TableCell class='table-cell'>{{ stage.duration }}</TableCell>
          <TableCell class='table-cell'>{{ stage.lactate }}</TableCell>
          <TableCell class='table-cell'>{{ stage.heart_rate }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<style lang="css" scoped>
/* .table-cell {
  text-align: center;
} */
</style>
