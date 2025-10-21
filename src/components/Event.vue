<template>
  <q-card class="my-card" flat bordered>
    <q-item>
      <q-item-section avatar>
        <q-avatar>
          <img src="https://i.pinimg.com/originals/9e/83/75/9e837528f01cf3f42119c5aeeed1b336.jpg" />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label>Nicolas Delon</q-item-label>
        <q-item-label caption> il y a 12 minutes </q-item-label>
      </q-item-section>
      <q-space />
      <q-item-section class="text-right text-bold">
        <q-item-label> <q-icon color="green-8" name="payments" /> 10.000ar</q-item-label>
      </q-item-section>
    </q-item>
    <q-img
      src="https://i.pinimg.com/1200x/06/30/e6/0630e63a37d7ef817f4705d1627bd89d.jpg"
      :ratio="16 / 9"
    />
    <div class="row items-center q-mx-xs">
      <p class="text-h6 text-bold"><q-icon name="event" />Mahaleo</p>
      <q-space />
      <p><q-icon name="place" color="red" />Fianarantsoa</p>
    </div>
    <q-card-actions>
      <q-btn no-caps flat round color="positive" icon="receipt" label="Reserver" />
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
