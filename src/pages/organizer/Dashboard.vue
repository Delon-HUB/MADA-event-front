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
        <p class="text-overline full-width">17 événements en total</p>
      </div>
      <div class="row text-center">
        <div class="col">
          <q-card flat bordered class="q-ma-xs">
            <q-knob
              :max="total"
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
              :max="total"
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
              :max="total"
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
          <q-item-label>350</q-item-label>
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple>
        <q-item-section avatar>
          <q-icon color="light-green" name="payments" />
        </q-item-section>

        <q-item-section>Gains total</q-item-section>
        <q-item-section side>
          <q-item-label>150000ar</q-item-label>
        </q-item-section>
      </q-item>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useEventStore } from '@/stores/Event.store'
import { watch, ref } from 'vue'

const $eventStore = useEventStore()
const total = ref<number>($eventStore.all.length)

watch(
  () => $eventStore.all,
  () => {
    total.value = $eventStore.all.length
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
