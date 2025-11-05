<template>
  <q-list>
    <Event :event="event" v-for="event in events" class="q-ma-xs" />
  </q-list>
</template>
<script setup lang="ts">
import Event from '@/components/Event.vue'
import { useEventStore } from '@/stores/Event.store'
import { computed } from 'vue'

const $eventStore = useEventStore()
const events = computed(() => $eventStore.inProgress.concat($eventStore.coming))
</script>
