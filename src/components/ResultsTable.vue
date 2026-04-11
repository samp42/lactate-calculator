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
      <TableCaption>Samuel's Ramp Test Results</TableCaption>
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
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-for="stage in props.ramp_test.stages" :key="stage.num">
          <TableCell>{{ stage.num }}</TableCell>
          <TableCell>{{ stage.power }}</TableCell>
          <TableCell>{{ stage.duration }}</TableCell>
          <TableCell>{{ stage.lactate }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </div>
</template>

<style lang="css" scoped></style>
