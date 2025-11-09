<template>
  <q-dialog class="page" v-model="model" persistent transition-show="scale" transition-hide="scale">
    <q-card class="page" style="width: 300px">
      <q-card-section class="text-center">
        <p>
          <span class="text-bold">Personnalisez votre filtre</span>
        </p>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-select
          class="q-mb-md"
          outlined
          v-model="event.category"
          :options="categories"
          label="Catégorie"
          clearable
        />
      </q-card-section>

      <q-card-actions align="right" class="bg-white">
        <q-btn outline no-caps label="OK" @click="() => emit('finish', event)" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ECategory } from '@/enums/ECategory'
import type { IEvent } from '@/interfaces/IEvent'
import { ref } from 'vue'

const model = defineModel<boolean>()
const emit = defineEmits(['finish'])
let categories = ref<string[]>(Object.entries(ECategory).map((val) => val[1]))
categories.value.unshift('Tous')

const event = ref<Partial<IEvent>>({})
</script>

<style scoped>
.page {
  background-color: #f1efe3;
}
</style>
