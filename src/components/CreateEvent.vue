<template>
  <div>
    <q-dialog v-model="model" maximized>
      <q-layout view="Lhh lpR fff" container class="background-page">
        <q-header>
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
                  hide-upload-btn
                  :auto-upload="false"
                  accept="image/*"
                  @added="(files) => (file = (files as File[])[0])"
                  @removed="() => (file = undefined)"
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
                <q-btn
                  v-if="!location"
                  outline
                  no-caps
                  color="primary"
                  label="Localisation"
                  icon="place"
                  class="fit q-mb-md"
                  @click="() => (showLocation = true)"
                />
                <q-item
                  v-else
                  clickable
                  v-ripple
                  @click="() => (showLocation = true)"
                  class="q-mb-md text-bold"
                >
                  <q-item-section avatar>
                    <q-icon name="place" color="positive" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label lines="1">
                      {{ regionSelected?.name }}
                    </q-item-label>
                    <q-item-label caption>
                      {{ districtSelected?.name?.concat(', ') }}
                      {{ communeSelected?.name?.concat(', ') }}
                      {{ quarterSelected?.name }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <location
                  @selectedLocation="(data: any) => (location = data)"
                  v-model="showLocation"
                />
                <q-input
                  color="green"
                  outlined
                  v-model="newEvent.address"
                  type="text"
                  label="adresse exacte"
                  class="q-mb-md"
                />
                <div class="row q-mb-md">
                  <div class="col q-mr-xs">
                    <q-input outlined v-model="startDateString" type="date" label="date du début" />
                  </div>
                  <div class="col">
                    <q-input
                      outlined
                      v-model="startTimeString"
                      type="time"
                      label="heure du début"
                    />
                  </div>
                </div>
                <div class="row q-mb-md">
                  <div class="col q-mr-xs">
                    <q-input outlined v-model="endDateString" type="date" label="date de fin" />
                  </div>
                  <div class="col">
                    <q-input outlined v-model="endTimeString" type="time" label="heure de fin" />
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
              :disable="!canContinue"
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
              :loading="loading"
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
import type { IEvent } from '@/interfaces/IEvent'
import { computed, reactive, ref, watch } from 'vue'
import Location from './Location.vue'
import type { IRegion } from '@/interfaces/IRegion.ts'
import type { IDistrict } from '@/interfaces/IDistrict.ts'
import type { ICommune } from '@/interfaces/ICommune.ts'
import type { IQuarter } from '@/interfaces/IQuarter.ts'

const model = defineModel<boolean>()
const step = ref<number>(1)
const loading = ref<boolean>(false)
const showLocation = ref(false)
const categories = Object.entries(ECategory).map((val) => val[1])

const location = ref<{
  type: 'REGION' | 'DISTRICT' | 'COMMUNE' | 'QUARTER'
  data: IRegion | IDistrict | ICommune | IQuarter
}>()

const regionSelected = ref<IRegion>()
const districtSelected = ref<IDistrict>()
const communeSelected = ref<ICommune>()
const quarterSelected = ref<IQuarter>()
const locationString = ref<string>('')

watch(
  () => location.value,
  () => extractLocation(location.value!.type, location.value!.data),
)

const extractLocation = (
  type: 'REGION' | 'DISTRICT' | 'COMMUNE' | 'QUARTER',
  data: IRegion | IDistrict | ICommune | IQuarter,
) => {
  regionSelected.value = undefined
  districtSelected.value = undefined
  communeSelected.value = undefined
  quarterSelected.value = undefined

  switch (type) {
    case 'REGION':
      regionSelected.value = data as IRegion
      break
    case 'DISTRICT':
      {
        districtSelected.value = data as IDistrict
        regionSelected.value = districtSelected.value.regionId as IRegion
      }
      break
    case 'COMMUNE':
      {
        communeSelected.value = data as ICommune
        districtSelected.value = communeSelected.value.districtId as IDistrict
        regionSelected.value = districtSelected.value.regionId as IRegion
      }
      break
    case 'QUARTER': {
      quarterSelected.value = data as IQuarter
      communeSelected.value = quarterSelected.value.communeId as ICommune
      districtSelected.value = communeSelected.value.districtId as IDistrict
      regionSelected.value = districtSelected.value.regionId as IRegion
    }
  }
  locationString.value =
    regionSelected.value.name.concat(',') +
    districtSelected.value?.name?.concat(',') +
    communeSelected.value?.name?.concat(',') +
    quarterSelected.value?.name
}
// DATA
const newEvent = reactive<IEvent>({
  title: '',
  category: '',
  photo: '',
  location: '',
  address: '',
  startDate: new Date(),
  endDate: new Date(),
  price: 0,
  capacity: 0,
  ownerId: '',
})
const startDateString = ref<string>('')
const startTimeString = ref<string>('')
const endDateString = ref<string>('')
const endTimeString = ref<string>('')

const file = ref<File>()

const canContinue = computed(() => {
  if (step.value == 1) {
    return newEvent.title.trim().length > 0 && newEvent.category.length > 0
  } else if (step.value == 2) {
    return (
      startDateString.value!.trim().length &&
      startTimeString.value!.trim().length > 0 &&
      endDateString.value!.trim().length &&
      endTimeString.value!.trim().length > 0 &&
      locationString.value.trim().length > 0 &&
      newEvent.address.trim().length > 0
    )
  }
})

const createEvent = async () => {
  loading.value = true
  newEvent.location = locationString.value
  newEvent.startDate = formatDate(startDateString.value!, startTimeString.value!)
  newEvent.endDate = formatDate(endDateString.value!, endTimeString.value!)

  const formData = new FormData()
  if (file.value) formData.append('image', file.value)
  ;(Object.keys(newEvent) as (keyof IEvent)[]).forEach((key) =>
    formData.append(key, newEvent[key] as string),
  )
  const response = await secureAPI.post('/event', formData)
  loading.value = false
  if (response.status < 400) model.value = false
}

// UTILS
const formatDate = (dateString: string, timeString: string): Date => {
  const hours = parseInt(timeString?.split(':')[0] || '')
  const minutes = parseInt(timeString?.split(':')[1] || '')
  const date = new Date(dateString || '')
  date.setHours(hours)
  date.setMinutes(minutes)

  return date
}
</script>

<style scoped>
.background-page {
  background-color: #f1efe3;
}
</style>
