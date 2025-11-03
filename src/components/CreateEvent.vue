<template>
  <div>
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
          <q-page>
            <q-stepper flat v-model="step" vertical animated class="fit background-page">
              <q-step
                color="dark"
                done-color="positive"
                :name="1"
                title="Informations générales"
                icon="settings"
                :done="step > 1"
              >
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
                  v-model="categorieSelected"
                  :options="categories"
                  label="Catégorie"
                />
                <div class="row q-mb-md">
                  <div class="col q-mr-xs">
                    <q-input outlined v-model="date" type="number" label="Prix (Ariary)" />
                  </div>
                  <div class="col">
                    <q-input outlined v-model="time" type="number" label="Nombre de place" />
                  </div>
                </div>
              </q-step>
              <q-step
                :name="2"
                title="Localisation et horaire"
                icon="create_new_folder"
                :done="step > 2"
                color="dark"
                done-color="positive"
              >
                <q-select
                  v-model="localisationSelected"
                  use-input
                  outlined
                  hide-selected
                  fill-input
                  input-debounce="0"
                  label="Ville"
                  :options="options"
                  @filter="filterFn"
                  class="q-mb-md"
                />
                <q-input
                  color="green"
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
                <div class="row q-mb-md">
                  <div class="col q-mr-xs">
                    <q-input outlined v-model="date" type="date" label="date du début" />
                  </div>
                  <div class="col">
                    <q-input outlined v-model="time" type="time" label="heure du début" />
                  </div>
                </div>
                <div class="row q-mb-md">
                  <div class="col q-mr-xs">
                    <q-input outlined v-model="date" type="date" label="date de fin" />
                  </div>
                  <div class="col">
                    <q-input outlined v-model="time" type="time" label="heure de fin" />
                  </div>
                </div>
              </q-step>

              <q-step
                color="dark"
                done-color="positive"
                :name="3"
                title="Détaillez ce que vous proposez"
                icon="add_comment"
                caption="(Facultatif)"
              >
                <q-input
                  label="Déscription détaillés"
                  type="textarea"
                  v-model="title"
                  outlined
                  autogrow
                />

                <q-select
                  filled
                  v-model="localisationSelected"
                  clearable
                  use-input
                  hide-selected
                  fill-input
                  input-debounce="0"
                  label="Autoselect after filtering"
                  :options="options"
                  @filter="filterFn"
                  style="width: 250px; height: 250px"
                >
                  <template v-slot:no-option>
                    <q-item>
                      <q-item-section class="text-grey"> No results </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </q-step>
            </q-stepper>
          </q-page>
        </q-page-container>

        <q-footer class="background-page q-pa-md">
          <q-stepper-navigation class="row">
            <q-btn
              class="col q-mr-sm"
              @click="step > 1 ? step-- : step"
              color="dark"
              label="Retour"
              outline
              no-caps
              icon="arrow_circle_left"
            />
            <q-btn
              no-caps
              class="col"
              @click="step < 3 ? step++ : step"
              color="positive"
              :label="step < 3 ? 'Continuer' : 'Publier'"
              icon-right="arrow_circle_right"
            />
          </q-stepper-navigation>
        </q-footer>
      </q-layout>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ECategory } from '@/enums/ECategory'
import { secureAPI } from '@/instances/axios'
import type { ICreateDistrictDto } from '@/interfaces/IDistrict'
import { onBeforeMount, ref } from 'vue'

const step = ref<number>(1)
const model = defineModel<boolean>()
const categories = Object.entries(ECategory).map((val) => val[1])
const localisationList = ref<string[]>([])
onBeforeMount(async () => {
  const districts = (await secureAPI.post('/localisation/district')).data as ICreateDistrictDto[]
  const districtStrings = districts.map((district) => {
    const districtString = [
      district.regionId.provinceId.province,
      district.regionId.region,
      district.district,
    ]
    return districtString.join(',')
  })
  localisationList.value = districtStrings
})

const title = ref<string>()
const categorieSelected = ref<string>()
const localisationSelected = ref<string>()

const date = ref()
const time = ref()

const options = ref<string[]>(localisationList.value)
function filterFn(val: string, update: CallableFunction) {
  if (!val.trim()) {
    update(() => {
      options.value = localisationList.value
    })
    return
  }

  update(() => {
    options.value = localisationList.value.filter(
      (v: string) => v.toLowerCase().indexOf(val.toLowerCase()) > -1,
    )
  })
}
</script>

<style scoped>
.positif-color {
  background-color: #14452f;
}

.background-page {
  background-color: #f1efe3;
}
</style>
