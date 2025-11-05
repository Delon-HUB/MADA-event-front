<template>
  <q-page>
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
    <q-tab-panels v-model="tab" animated class="page">
      <q-tab-panel name="tab1">
        <Event v-for="event in events" :event="event" class="q-mb-xs" />
      </q-tab-panel>

      <q-tab-panel name="tab2">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Praesentium quae commodi delectus
        officiis repellat voluptatibus error, voluptatum voluptate consectetur, cum corrupti iure
        amet corporis excepturi tempore odit, sed laborum ipsa.
      </q-tab-panel>

      <q-tab-panel name="tab3">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, harum officia beatae
        voluptatem aliquam temporibus eveniet quod tempora. Repellendus magni reprehenderit eos sed
        obcaecati consequuntur nostrum aperiam quisquam quam. Ipsam.
      </q-tab-panel>
      <q-tab-panel name="tab4">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, harum officia beatae
        voluptatem aliquam temporibus eveniet quod tempora. Repellendus magni reprehenderit eos sed
        obcaecati consequuntur nostrum aperiam quisquam quam. Ipsam.
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
import { ref } from 'vue'

const $eventStore = useEventStore()
const tab = ref('tab1')
const show = ref<boolean>(false)
const events = ref<IEvent[]>($eventStore.getEvents())
</script>

<style scoped>
.page {
  background-color: #f1efe3;
}
</style>
