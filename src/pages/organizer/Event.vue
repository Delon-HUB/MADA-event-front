<template>
  <q-page class="page">
    <q-header bordered class="page text-black">
      <div class="row text-h6 text-bold">
        <div class="col">Mes événements</div>
        <div class="col text-right">
          <q-btn
            no-caps
            flat
            color="positive"
            icon="add_circle"
            label="Créer"
            @click="() => (show = true)"
          />
        </div>
      </div>
      <q-tabs no-caps v-model="tab" indicator-color="positive" align="justify">
        <q-tab name="tab1" label="Tous" />
        <q-tab name="tab2" label="À venir" />
        <q-tab name="tab3" label="En cours" />
        <q-tab name="tab4" label="Terminé" />
      </q-tabs>
    </q-header>
    <q-tab-panels v-model="tab" animated class="page">
      <q-tab-panel name="tab1">
        <Event v-for="event in all" :event="event" class="q-mb-xs" />
      </q-tab-panel>

      <q-tab-panel name="tab2">
        <Event v-for="event in coming" :event="event" class="q-mb-xs" />
      </q-tab-panel>

      <q-tab-panel name="tab3">
        <Event v-for="event in inProgress" :event="event" class="q-mb-xs" />
      </q-tab-panel>
      <q-tab-panel name="tab4">
        <Event v-for="event in terminated" :event="event" class="q-mb-xs" />
      </q-tab-panel>
    </q-tab-panels>
    <CreateEvent v-model="show" />
  </q-page>
</template>

<script setup lang="ts">
import CreateEvent from '@/components/CreateEvent.vue'
import Event from '@/components/Event.vue'
import type { IEvent } from '@/interfaces/IEvent'
import { useEventStore } from '@/stores/Event.store'
import { ref, watch } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isBetween from 'dayjs/plugin/isBetween'

import 'dayjs/locale/fr'

const $eventStore = useEventStore()
const tab = ref('tab1')
const show = ref<boolean>(false)

dayjs.extend(relativeTime)
dayjs.extend(isBetween)
dayjs.locale('fr')

const all = ref<IEvent[]>([])
const inProgress = ref<IEvent[]>([])
const coming = ref<IEvent[]>([])
const terminated = ref<IEvent[]>([])

all.value = $eventStore.getEvents().value
watch(
  () => $eventStore.events,
  () => {
    all.value = $eventStore.getEvents().value
    inProgress.value = []
    coming.value = []
    terminated.value = []

    const currentDate = dayjs()
    all.value.forEach((event) => {
      if (currentDate.isBetween(dayjs(event.startDate), dayjs(event.endDate)))
        inProgress.value.push(event)
      else if (currentDate.isBefore(dayjs(event.startDate))) coming.value.push(event)
      else if (currentDate.isAfter(dayjs(event.startDate))) terminated.value.push(event)
    })
  },
)

const currentDate = dayjs()
all.value.forEach((event) => {
  if (currentDate.isBetween(event.startDate, event.endDate)) inProgress.value.push(event)
  else if (currentDate.isBefore(event.startDate)) coming.value.push(event)
  else if (currentDate.isAfter(event.startDate)) terminated.value.push(event)
})
</script>

<style scoped>
.page {
  background-color: #f1efe3;
}
</style>
