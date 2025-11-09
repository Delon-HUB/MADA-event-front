<template>
  <q-page>
    <q-header bordered class="header bg-white q-pa-xs text-black">
      <q-input
        outlined
        rounded
        v-model="text"
        color="green"
        placeholder="Que recherchez-vous ?"
        clearable
      >
        <template v-slot:after
          ><q-btn
            label="Filtres"
            flat
            no-caps
            icon="tune"
            @click="() => (showFilter = !showFilter)"
          />
          <Filter @finish="(options, ev) => search(options, ev)" v-model="showFilter" />
        </template>
      </q-input>
    </q-header>

    <q-list>
      <div v-if="searching">
        <Event :event="event" v-for="event in searchResult" class="q-ma-xs" />
        <p v-if="searchResult.length == 0" class="text-center text-overline">
          Aucun événement correspondant...
        </p>
      </div>

      <div v-else>
        <Event :event="event" v-for="event in events" class="q-ma-xs" />
        <p v-if="events.length == 0" class="text-center text-overline">
          Aucun événement disponible pour l'instant...
        </p>
      </div>
    </q-list>
  </q-page>
</template>
<script setup lang="ts">
import Filter from '@/components/Filter.vue'
import Event from '@/components/Event.vue'
import { type IEvent } from '@/interfaces/IEvent'
import { useEventStore } from '@/stores/Event.store'
import { computed, ref, watch } from 'vue'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isBetween from 'dayjs/plugin/isBetween'
dayjs.extend(relativeTime)
dayjs.extend(isBetween)
dayjs.locale('fr')

const text = ref<string>()
const searching = ref<boolean>(false)
const showFilter = ref<boolean>(false)

const $eventStore = useEventStore()
const events = computed(() => $eventStore.inProgress.concat($eventStore.coming))
const searchResult = ref<IEvent[]>([])
watch(
  () => text.value,
  () => {
    if (!text.value?.trim()) searching.value = false
    else {
      searching.value = true
      searchResult.value = events.value.filter(
        (event) =>
          event.title
            ?.trim()
            .toLocaleLowerCase()
            .includes(text.value!.trim().toLocaleLowerCase()) ||
          event.location
            ?.trim()
            .toLocaleLowerCase()
            .includes(text.value!.trim().toLocaleLowerCase()) ||
          event.address
            ?.trim()
            .toLocaleLowerCase()
            .includes(text.value!.trim().toLocaleLowerCase()),
      )
    }
  },
)

const search = (options: { category: boolean; date: boolean }, event: Partial<IEvent>) => {
  searching.value = true
  searchResult.value = events.value
  if (options.category) {
    if (event.category && event.category != 'Tous')
      searchResult.value = events.value.filter((ev) => ev.category == event.category)
  }

  if (options.date) {
    const startDate = dayjs(new Date(event.startDate!).toDateString())
    const endDate = dayjs(new Date(event.endDate!).toDateString())

    switch (event.description) {
      case 'between':
        {
          searchResult.value = searchResult.value.filter((ev) =>
            dayjs(new Date(ev.startDate).toDateString()).isBetween(startDate, endDate),
          )
        }
        break
      case 'before':
        {
          searchResult.value = searchResult.value.filter((ev) =>
            dayjs(new Date(ev.startDate).toDateString()).isBefore(startDate),
          )
        }
        break
      case 'after':
        {
          searchResult.value = searchResult.value.filter((ev) =>
            dayjs(new Date(ev.startDate).toDateString()).isAfter(startDate),
          )
        }
        break
      case 'exactly':
        {
          searchResult.value = searchResult.value.filter((ev) =>
            dayjs(new Date(ev.startDate).toDateString()).isSame(startDate),
          )
        }
        break
    }
  }
}
</script>

<style scoped>
.page {
  background-color: #f1efe3;
}
.header {
  position: fixed;
  top: 0%;
}
</style>
