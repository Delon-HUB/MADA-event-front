<template>
  <q-dialog class="page" v-model="model" persistent transition-show="scale" transition-hide="scale">
    <q-card class="page">
      <q-card-section class="text-center">
        <p>
          <span class="text-bold">Personnalisez votre filtre</span> <br />Cochez le filtre à inclure
        </p>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row">
          <div class="col-2">
            <q-checkbox v-model="includes.category" />
          </div>
          <div class="col">
            <q-select
              class="q-mb-md"
              outlined
              v-model="event.category"
              :options="categories"
              label="Catégorie"
              clearable
            />
          </div>
        </div>
        <div class="row">
          <div class="col-2">
            <q-checkbox v-model="includes.date" />
          </div>
          <div class="col">
            <div>
              <div>
                <q-radio
                  size="xs"
                  v-model="shape"
                  checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye"
                  val="exactly"
                  label="Exactement"
                />
                <q-radio
                  size="xs"
                  v-model="shape"
                  checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye"
                  val="before"
                  label="Avant"
                />
                <q-radio
                  size="xs"
                  v-model="shape"
                  checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye"
                  val="after"
                  label="Après"
                />
                <q-radio
                  size="xs"
                  v-model="shape"
                  checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye"
                  val="between"
                  label="Entre deux dates"
                />
              </div>

              <div class="q-px-sm">
                <div class="row">
                  <div class="col q-mr-xs">
                    <q-input outlined v-model="startDateString" type="date" />
                  </div>
                  <div class="col" v-if="shape == 'between'">
                    <q-input outlined v-model="endDateString" type="date" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="bg-white">
        <q-btn outline no-caps label="OK" @click="finish" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ECategory } from '@/enums/ECategory'
import type { IEvent } from '@/interfaces/IEvent'
import { ref } from 'vue'

let categories = ref<string[]>(Object.entries(ECategory).map((val) => val[1]))
categories.value.unshift('Tous')
const shape = ref<string>('between')
const model = defineModel<boolean>()

const includes = ref<{ category: boolean; date: boolean }>({
  category: false,
  date: false,
})

const event = ref<Partial<IEvent>>({})
const startDateString = ref<string>()
const endDateString = ref<string>()

const emit = defineEmits(['finish'])

const finish = () => {
  if (includes.value.date) {
    event.value.description = shape.value
    event.value.startDate = new Date(startDateString.value || '')
    event.value.endDate = new Date(endDateString.value || '')
  }
  emit('finish', includes.value, event.value)
}
</script>

<style scoped>
.page {
  background-color: #f1efe3;
}
</style>
