<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-vue-next';
import DataInputTable from './DataInputTable.vue';
</script>

<template>
  <div>
    <Button>
      <PlusIcon />
    </Button>

    <DataInputTable />

    <Button>Go to results</Button>
  </div>
</template>
