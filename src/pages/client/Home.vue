<template>
  <q-list>
    <Event :event="event" v-for="event in events" class="q-ma-xs" />
  </q-list>
</template>
<script setup lang="ts">
import Event from '@/components/Event.vue'
import type { IEvent } from '@/interfaces/IEvent'
import { useEventStore } from '@/stores/Event.store'
import { ref, watch } from 'vue'

const $eventStore = useEventStore()

const events = ref<IEvent[]>([])
events.value = $eventStore.getEvents().value
watch(
  () => $eventStore.events,
  () => {
    events.value = $eventStore.getEvents().value
  },
)
</script>
