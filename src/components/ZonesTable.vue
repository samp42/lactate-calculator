<script setup lang="ts">
import {
  Table,
  TableCaption,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
} from './ui/table'
</script>

<template>
  <Table>
    <TableCaption>Samuel's Power and Heart Rate Zones</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>
          <h3>Zone</h3>
        </TableHead>
        <TableHead>
          <h3>Power (W)</h3>
        </TableHead>
        <TableHead>
          <h3>Heart Rate (BPM)</h3>
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow></TableRow>
    </TableBody>
  </Table>
</template>
