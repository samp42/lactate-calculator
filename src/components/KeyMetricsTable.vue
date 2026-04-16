<script setup lang="ts">
import { Card, CardContent, CardHeader } from './ui/card';
import {
  Table,
  TableCaption,
  TableCell,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
} from './ui/table';
</script>

<template>
  <Card>
    <CardHeader>
      <h2>Key Metrics</h2>
    </CardHeader>
    <CardContent>
      <Table class='px-3'>
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
          <TableRow>
            <TableCell>
              <h3>Athlete Weight</h3>
            </TableCell>
            <TableCell class='table-cell'>61 kg</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <h3>Max Heart Rate</h3>
            </TableCell>
            <TableCell class='table-cell'>186 BPM</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <h3>LT1 Power</h3>
            </TableCell>
            <TableCell class='table-cell'>202 W - 1.2 mmol/L</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <h3>LT1 Heart Rate</h3>
            </TableCell>
            <TableCell class='table-cell'>143 BPM - 77% of Max</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <h3>LT2 Power</h3>
            </TableCell>
            <TableCell class='table-cell'>282 W - 4.6 mmol/L</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <h3>LT2 Heart Rate</h3>
            </TableCell>
            <TableCell class='table-cell'>174 BPM - 93% of Max</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <h3>Maximal Aerobic Power</h3>
            </TableCell>
            <TableCell class='table-cell'>343 W</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <h3>VO2 Max (Absolute)</h3>
            </TableCell>
            <TableCell class='table-cell'>4.35 L/min</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <h3>VO2 Max (Relative)</h3>
            </TableCell>
            <TableCell class='table-cell'>71.3 ml/kg/min</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <h3>Fatmax Power</h3>
            </TableCell>
            <TableCell class='table-cell'>192 W - 56% of MAP</TableCell>
          </TableRow>
        </TableBody>
      </Table>

    </CardContent>
  </Card>

</template>
