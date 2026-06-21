<template>
  <q-page class="page">
    <q-header bordered class="page header text-black">
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
        <q-tab name="tab4" label="Annulé" />
        <q-tab name="tab5" label="Terminé" />
      </q-tabs>
    </q-header>
    <q-tab-panels v-model="tab" animated class="page">
      <q-tab-panel name="tab1">
        <q-list>
          <p v-if="!$eventStore.all.length" class="text-center text-overline">Aucun événement...</p>
          <Event
            v-for="event in $eventStore.all"
            :event="event"
            :key="event._id?.concat(event.status!)"
            class="q-mb-xs"
          />
        </q-list>
      </q-tab-panel>

      <q-tab-panel name="tab2">
        <q-list>
          <p v-if="!$eventStore.upcoming.length" class="text-center text-overline">
            Aucun événement...
          </p>
          <Event
            v-for="event in $eventStore.upcoming"
            :event="event"
            :key="event._id?.concat(event.status!)"
            class="q-mb-xs"
          />
        </q-list>
      </q-tab-panel>

      <q-tab-panel name="tab3">
        <q-list>
          <p v-if="!$eventStore.ongoing.length" class="text-center text-overline">
            Aucun événement...
          </p>
          <Event
            v-for="event in $eventStore.ongoing"
            :event="event"
            :key="event._id?.concat(event.status!)"
            class="q-mb-xs"
          />
        </q-list>
      </q-tab-panel>
      <q-tab-panel name="tab4">
        <q-list>
          <p v-if="!$eventStore.canceled.length" class="text-center text-overline">
            Aucun événement...
          </p>
          <Event
            v-for="event in $eventStore.canceled"
            :event="event"
            :key="event._id?.concat(event.status!)"
            class="q-mb-xs"
          />
        </q-list>
      </q-tab-panel>
      <q-tab-panel name="tab5">
        <q-list>
          <p v-if="!$eventStore.terminated.length" class="text-center text-overline">
            Aucun événement...
          </p>
          <Event
            v-for="event in $eventStore.terminated"
            :event="event"
            :key="event._id?.concat(event.status!)"
            class="q-mb-xs"
          />
        </q-list>
      </q-tab-panel>
    </q-tab-panels>
    <CreateEvent v-model="show" />
  </q-page>
</template>

<script setup lang="ts">
import CreateEvent from '@/components/CreateEvent.vue'
import Event from '@/components/Event.vue'
import { useEventStore } from '@/stores/Event.store'
import { ref } from 'vue'

const $eventStore = useEventStore()
const tab = ref('tab1')
const show = ref<boolean>(false)
</script>

<style scoped>
.header {
  position: fixed;
  top: 0%;
}

.page {
  background-color: #f1efe3;
}

.q-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
