<template>
  <q-page class="page q-mx-sm">
    <q-header bordered class="page header">
      <q-toolbar>
        <q-toolbar-title class="text-black text-bold">
          <q-icon name="bar_chart_4_bars" />Statistiques</q-toolbar-title
        >
      </q-toolbar>
    </q-header>
    <q-card flat>
      <div class="row text-center">
        <p class="text-overline full-width">{{ $eventStore.all.length }} événements en total</p>
      </div>
      <div class="row text-center">
        <div class="col">
          <q-card flat bordered class="q-ma-xs">
            <q-knob
              :max="totalEvent"
              :min="0"
              show-value
              class="text-white q-ma-md"
              v-model="$eventStore.coming.length"
              size="64px"
              :thickness="0.2"
              color="black"
              center-color="light"
              track-color="grey-3"
              ><span class="text-bold text-black">{{ $eventStore.coming.length }}</span></q-knob
            >
            <p class="text-bold">À venir</p>
          </q-card>
        </div>
        <div class="col">
          <q-card flat bordered class="q-ma-xs">
            <q-knob
              :max="totalEvent"
              :min="0"
              show-value
              class="text-white q-ma-md"
              v-model="$eventStore.inProgress.length"
              size="64px"
              :thickness="0.2"
              color="green"
              center-color="light"
              track-color="grey-3"
              ><span class="text-bold text-green">{{ $eventStore.inProgress.length }}</span></q-knob
            >
            <p class="text-bold">Encours</p>
          </q-card>
        </div>
        <div class="col">
          <q-card flat bordered class="q-ma-xs">
            <q-knob
              :max="totalEvent"
              :min="0"
              show-value
              class="text-white q-ma-md"
              v-model="$eventStore.terminated.length"
              size="64px"
              :thickness="0.2"
              color="red"
              center-color="light"
              track-color="grey-3"
              ><span class="text-bold text-red">{{ $eventStore.terminated.length }}</span></q-knob
            >
            <p class="text-bold">Terminé</p>
          </q-card>
        </div>
      </div>
    </q-card>
    <q-card flat class="q-mt-md">
      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon color="red" name="receipt" />
        </q-item-section>

        <q-item-section>Billet vendu</q-item-section>
        <q-item-section side>
          <q-item-label>{{ tickets }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon color="light-green" name="payments" />
        </q-item-section>

        <q-item-section>Gains total</q-item-section>
        <q-item-section side>
          <q-item-label>{{ gain }} ar</q-item-label>
        </q-item-section>
      </q-item>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useEventStore } from '@/stores/Event.store'
import { watch, ref } from 'vue'

const $eventStore = useEventStore()
$eventStore.all.forEach((ev) => $eventStore.repartition(ev))

const totalEvent = ref<number>(0)
const tickets = ref<number>(0)
const gain = ref<number>(0)

const recalculateData = () => {
  totalEvent.value = $eventStore.all.length
  $eventStore.all.forEach((ev) => {
    if (ev.participants && ev.participants.length > 0) {
      gain.value += ev.price * ev.participants.length
      tickets.value += ev.participants.length
    }
  })
}

recalculateData()

watch(
  () => $eventStore.all,
  () => {
    recalculateData()
  },
)
</script>

<style scoped>
.header {
  position: fixed;
  top: 0%;
}

.page {
  background-color: #f1efe3;
}

.my-card {
  width: 20%;
  height: 100px;
}
</style>
