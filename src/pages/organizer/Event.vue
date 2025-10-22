<template>
  <q-page>
    <div class="row text-h6 text-bold">
      <div class="col">Mes événements</div>
      <div class="col text-right">
        <q-btn no-caps flat color="positive" icon="add" label="Créer" />
      </div>
    </div>
    <q-tabs no-caps v-model="tab" indicator-color="positive" align="justify">
      <q-tab name="tab1" label="À venir" />
      <q-tab name="tab2" label="En cours" />
      <q-tab name="tab3" label="Terminé" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated class="page">
      <q-tab-panel name="tab1">
        <div class="text-h6">Mails</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>

      <q-tab-panel name="tab2">
        <div class="text-h6">Alarms</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>

      <q-tab-panel name="tab3">
        <div class="text-h6">Movies</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const tab = ref('tab1')
</script>

<style scoped>
.page {
  background-color: #f1efe3;
}
</style>
