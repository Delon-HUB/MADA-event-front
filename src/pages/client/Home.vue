<template>
  <q-list>
    <Event :event="event" v-for="event in $eventStore.all" class="q-ma-xs" />
  </q-list>
</template>
<script setup lang="ts">
import Event from '@/components/Event.vue'
import { useEventStore } from '@/stores/Event.store'

const $eventStore = useEventStore()
</script>
