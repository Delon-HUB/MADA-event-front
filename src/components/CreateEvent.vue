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
                  label="Image de couverture"
                  flat
                  v-model="newEvent.photo"
                  hide-upload-btn
                />
                <q-input
                  color="green"
                  outlined
                  v-model="newEvent.title"
                  type="text"
                  label="Titre de l'événement"
                  :rules="[
                    () =>
                      /^[A-ZÀ-Ýa-zà-ÿ'\-\s]{1,49}$/.test(newEvent.title || '') ||
                      'Veuillez entrer un titre valide',
                  ]"
                  lazy-rules
                />
                <q-select
                  class="q-mb-md"
                  outlined
                  v-model="newEvent.category"
                  :options="categories"
                  label="Catégorie"
                />
                <div class="row q-mb-md">
                  <div class="col q-mr-xs">
                    <q-input
                      outlined
                      v-model="newEvent.price"
                      type="number"
                      label="Prix (Ariary)"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      outlined
                      v-model="newEvent.capacity"
                      type="number"
                      label="Nombre de place"
                    />
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
                  v-model="newEvent.location"
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
                  v-model="newEvent.address"
                  type="text"
                  label="adresse"
                  :rules="[
                    () =>
                      /^[A-ZÀ-Ýa-zà-ÿ'\-\s]{1,49}$/.test(newEvent.address || '') ||
                      'Veuillez entrer un titre valide',
                  ]"
                  lazy-rules
                />
                <div class="row q-mb-md">
                  <div class="col q-mr-xs">
                    <q-input outlined v-model="startDate" type="date" label="date du début" />
                  </div>
                  <div class="col">
                    <q-input outlined v-model="startTime" type="time" label="heure du début" />
                  </div>
                </div>
                <div class="row q-mb-md">
                  <div class="col q-mr-xs">
                    <q-input outlined v-model="endDate" type="date" label="date de fin" />
                  </div>
                  <div class="col">
                    <q-input outlined v-model="endTime" type="time" label="heure de fin" />
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
                  v-model="newEvent.description"
                  outlined
                  autogrow
                />
              </q-step>
            </q-stepper>
          </q-page>
        </q-page-container>

        <q-footer class="background-page q-pa-md">
          <q-stepper-navigation class="row">
            <q-btn
              class="col q-mr-sm"
              v-if="step != 1"
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
              label="Continuer"
              v-if="step < 3"
              icon-right="arrow_circle_right"
            />
            <q-btn
              no-caps
              class="col"
              v-else
              @click="createEvent"
              color="positive"
              label="Publier"
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
import type { IEvent } from '@/interfaces/IEvent'
import { onBeforeMount, reactive, ref } from 'vue'

const step = ref<number>(1)
const model = defineModel<boolean>()

//location
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

const categories = Object.entries(ECategory).map((val) => val[1])

//data
const newEvent = reactive<IEvent>({
  title: '',
  category: '',
  photo: '',
  location: '',
  address: '',
  startDate: new Date(),
  endDate: new Date(),
  price: 0,
  participants: [],
})

//date & time
const startDate = ref<string>()
const startTime = ref<string>()
const endDate = ref<string>()
const endTime = ref<string>()

const createEvent = () => {
  //start
  const startHours = parseInt(startTime.value?.split(':')[0] || '')
  const startMinutes = parseInt(startTime.value?.split(':')[1] || '')
  const _startDate = new Date(startDate.value || '')
  _startDate.setHours(startHours)
  _startDate.setMinutes(startMinutes)
  //end
  const endHours = parseInt(endTime.value?.split(':')[0] || '')
  const endMinutes = parseInt(endTime.value?.split(':')[1] || '')
  const _endDate = new Date(endDate.value || '')
  _endDate.setHours(endHours)
  _endDate.setMinutes(endMinutes)

  newEvent.startDate = _startDate
  newEvent.endDate = _endDate

  console.log(newEvent)
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
