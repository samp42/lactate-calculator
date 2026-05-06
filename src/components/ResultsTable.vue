<script setup lang="ts">
import { DownloadIcon } from 'lucide-vue-next';
import { Button } from './ui/button';
import { Card, CardHeader, CardContent } from './ui/card'

import {
  Table,
  TableCaption,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
} from './ui/table'
import type { RampTest } from '@/lib/models'

const props = defineProps<{
  ramp_test: RampTest
}>()

function exportCSV() {
  const headers = Object.keys(props.ramp_test.stages[0]!);
  const rows = props.ramp_test.stages.map(row =>
    headers.map(h => {
      const val = String((row as unknown as Record<string, unknown>)[h] ?? "");
      // Wrap in quotes if value contains comma, quote, or newline
      return /[",\n]/.test(val) ? `"${val.replace(/"/g, '""')}"` : val;
    }).join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const date = new Date().toISOString().slice(0, 10)
  const filename = `${props.ramp_test.name?.toUpperCase() ?? 'ramp_test'}_${date}.csv`

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}
</script>

<template>
  <div>
    <Card>
      <CardHeader>
        <div class='flex justify-between'>
          <h2>Ramp Test Results</h2>
          <Button class="flex align-bottom" variant='outline' @click='exportCSV'>
            <DownloadIcon />
            <h3 class="pl-2">Export CSV</h3>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Ramp Test Results
            {{ props.ramp_test.name !== null ? 'for ' + props.ramp_test.name : '' }}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>
                <h3 class="table-head">Stage</h3>
              </TableHead>
              <TableHead>
                <h3 class="table-head">Power (W)</h3>
              </TableHead>
              <TableHead>
                <h3 class="table-head">Duration (s)</h3>
              </TableHead>
              <TableHead>
                <h3 class="table-head">Lactate (mmol/L)</h3>
              </TableHead>
              <TableHead>
                <h3 class="table-head">Heart Rate (BPM)</h3>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="stage in props.ramp_test.stages" :key="stage.num">
              <TableCell class="table-cell">{{ stage.num }}</TableCell>
              <TableCell class="table-cell">{{ stage.intensity }}</TableCell>
              <TableCell class="table-cell">{{ stage.duration }}</TableCell>
              <TableCell class="table-cell">{{ stage.lactate }}</TableCell>
              <TableCell class="table-cell">{{ stage.heart_rate }}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
</template>

<style lang="css" scoped>
/* .table-cell {
  text-align: center;
} */
</style>
