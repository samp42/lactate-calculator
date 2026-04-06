<script setup lang="ts">
import { Button } from '@/components/ui/button'
// import { Icon } from 'lucide-vue-next';
import { PlusIcon } from 'lucide-vue-next';
import DataInputTable from './DataInputTable.vue';
</script>

<template>
  <div>
    <Button>
      <!-- <Icon /> -->
      <PlusIcon />
    </Button>

    <DataInputTable />

  </div>
</template>
