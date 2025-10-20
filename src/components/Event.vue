<template>
  <q-card class="my-card" flat bordered>
    <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" />

    <q-card-section>
      <div class="text-h6">Spéctacle</div>
      <div class="text-overline text-orange-9">Fianarantsoa</div>
    </q-card-section>

    <q-card-actions>
      <q-btn no-caps flat round color="primary" label="Reserver" />
      <q-space />
      <q-btn
        color="grey"
        round
        flat
        dense
        no-caps
        label="détails"
        :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
        @click="expanded = !expanded"
      />
    </q-card-actions>

    <q-slide-transition>
      <div v-show="expanded">
        <q-separator />
        <q-card-section class="text-subtitle2">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deserunt blanditiis sit
          voluptates dolores nihil? Minima sapiente, aperiam laboriosam facilis corporis libero
          officiis in eveniet, modi illum vitae voluptas vel amet!
        </q-card-section>
      </div>
    </q-slide-transition>
  </q-card>
</template>
<script setup lang="ts">
import { ref } from 'vue'

const expanded = ref(false)
</script>
