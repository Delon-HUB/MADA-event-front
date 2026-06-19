<template>
  <q-dialog v-model="model" style="max-width: 250px">
    <q-layout view="Lhh lpR fff" container>
      <q-header>
        <q-toolbar>
          <q-btn class="text-bold" flat no-caps icon="place">Chercher un lieu</q-btn>
          <q-space />
          <q-btn flat v-close-popup round dense icon="cancel" />
        </q-toolbar>
        <q-toolbar class="bg-grey-1 q-pa-sm row">
          <q-input
            placeholder="ex: region, district, commune ou quartier"
            v-model="searchPayload"
            debounce="500"
            filled
            class="col"
          />
          <q-btn flat icon="search" color="black" class="col-2" size="32px" />
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page>
          <q-list bordered padding class="fit bg-grey-1">
            <q-item
              clickable
              v-ripple
              :active="selected === 'outbox'"
              @click="selected = 'outbox'"
              active-class="my-menu-link"
            >
              <q-item-section avatar>
                <q-icon name="place" />
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1">Andoharanomaintso</q-item-label>
                <q-item-label caption>Haute mahatsiatra</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const model = defineModel<boolean>()
const selected = ref('inbox')
const searchPayload = ref<string>('')
</script>

<style scoped></style>
