<template>
  <q-page>
    <q-header bordered class="page q-pa-xs text-black">
      <q-input
        outlined
        rounded
        v-model="text"
        color="green"
        placeholder="Que recherchez-vous ?"
        clearable
      >
        <template v-slot:after><q-btn label="Filtres" flat no-caps icon="tune" /></template>
      </q-input>
    </q-header>

    <q-list>
      <Event v-if="searching" :event="event" v-for="event in searchResult" class="q-ma-xs" />
      <Event v-else :event="event" v-for="event in events" class="q-ma-xs" />
    </q-list>
  </q-page>
</template>
<script setup lang="ts">
import Event from '@/components/Event.vue'
import { type IEvent } from '@/interfaces/IEvent'
import { useEventStore } from '@/stores/Event.store'
import { computed, ref, watch } from 'vue'

const text = ref<string>()
const searching = ref<boolean>(false)

const $eventStore = useEventStore()
const events = computed(() => $eventStore.inProgress.concat($eventStore.coming))
const searchResult = ref<IEvent[]>([])
watch(
  () => text.value,
  () => {
    if (!text.value?.trim()) searching.value = false
    else {
      searching.value = true
      searchResult.value = events.value.filter((event) =>
        event.title.trim().toLocaleLowerCase().includes(text.value!.trim().toLocaleLowerCase()),
      )
    }
  },
)

watch(searchResult.value, () => console.log(searchResult.value))
</script>

<style scoped>
.page {
  background-color: #f1efe3;
}
</style>
