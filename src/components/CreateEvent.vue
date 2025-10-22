<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="model" maximized>
      <q-layout view="Lhh lpR fff" container class="background-page">
        <q-header class="positif-color">
          <q-toolbar>
            <q-btn class="text-bold" flat no-caps icon="event">Créer un événements</q-btn>
            <q-space />
            <q-btn flat v-close-popup round dense icon="cancel" />
          </q-toolbar>
        </q-header>

        <q-page-container>
          <q-page padding>
            <q-uploader
              bordered
              text-color="dark"
              color="grey"
              class="fit background-page q-mb-md"
              url="http://localhost:4444/upload"
              label="Image de couverture"
              flat
            />
            <q-input
              color="green"
              outlined
              v-model="title"
              type="text"
              label="Titre de l'événement"
              :rules="[
                () =>
                  /^[A-ZÀ-Ýa-zà-ÿ'\-\s]{1,49}$/.test(title || '') ||
                  'Veuillez entrer un titre valide',
              ]"
              lazy-rules
            />
            <q-select
              class="q-mb-md"
              outlined
              v-model="select"
              :options="options"
              label="Catégorie"
            />

            <div class="row q-mb-md">
              <div class="col q-mr-xs">
                <q-select outlined v-model="select" :options="options" label="Ville" />
              </div>
              <div class="col">
                <q-input
                  color="green"
                  class="q-mb-md"
                  outlined
                  v-model="title"
                  type="text"
                  label="adresse"
                  :rules="[
                    () =>
                      /^[A-ZÀ-Ýa-zà-ÿ'\-\s]{1,49}$/.test(title || '') ||
                      'Veuillez entrer un titre valide',
                  ]"
                  lazy-rules
                />
              </div>
            </div>
          </q-page>
        </q-page-container>

        <q-footer class="background-page q-pa-md">
          <q-btn
            icon="publish"
            no-caps
            unelevated
            rounded
            label="Publier"
            class="fit text-bold positif-color"
        /></q-footer>
      </q-layout>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const model = defineModel<boolean>()

const title = ref<string>()
const options = ref<string[]>(['Google', 'Facebook', 'Twitter', 'Apple', 'Oracle'])
const select = ref<string>()
</script>

<style scoped>
.positif-color {
  background-color: #14452f;
}

.background-page {
  background-color: #f1efe3;
}
</style>
