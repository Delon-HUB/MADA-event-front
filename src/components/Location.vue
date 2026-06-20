<template>
  <q-dialog v-model="model" :maximized="$q.screen.lt.md" style="max-width: 250px">
    <q-layout view="Lhh lpR fff" container>
      <q-header>
        <q-toolbar>
          <q-item-label class="text-bold"
            ><q-icon name="place" size="32px" />Chercher un lieu</q-item-label
          >
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
          <q-btn flat icon="search" color="black" class="col-2" size="24px" @click="search" />
        </q-toolbar>
      </q-header>

      <q-page-container>
        <q-page>
          <q-list separator bordered padding class="fit bg-grey-1">
            <q-item
              v-for="region in regions"
              clickable
              v-ripple
              @click="() => selectLocation('REGION', region)"
            >
              <q-item-section avatar>
                <q-icon name="place" />
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1">{{ region.name }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              v-for="district in districts"
              clickable
              v-ripple
              @click="selectLocation('DISTRICT', district)"
            >
              <q-item-section avatar>
                <q-icon name="place" />
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1">{{ (district.regionId as IRegion).name }}</q-item-label>
                <q-item-label caption>{{ district.name }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item
              v-for="commune in communes"
              clickable
              v-ripple
              @click="selectLocation('COMMUNE', commune)"
            >
              <q-item-section avatar>
                <q-icon name="place" />
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1">{{
                  ((commune.districtId as IDistrict).regionId as IRegion).name
                }}</q-item-label>
                <q-item-label caption
                  >{{ (commune.districtId as IDistrict).name }}, {{ commune.name }}</q-item-label
                >
              </q-item-section>
            </q-item>

            <q-item
              v-for="quarter in quarters"
              clickable
              v-ripple
              @click="selectLocation('QUARTER', quarter)"
            >
              <q-item-section avatar>
                <q-icon name="place" />
              </q-item-section>

              <q-item-section>
                <q-item-label lines="1">{{
                  (((quarter.communeId as ICommune).districtId as IDistrict).regionId as IRegion)
                    .name
                }}</q-item-label>
                <q-item-label caption
                  >{{ ((quarter.communeId as ICommune).districtId as IDistrict).name }},
                  {{ (quarter.communeId as ICommune).name }}, {{ quarter.name }}</q-item-label
                >
              </q-item-section>
            </q-item>
          </q-list>
        </q-page>
      </q-page-container>
    </q-layout>
  </q-dialog>
</template>

<script setup lang="ts">
import type { ICommune } from '@/interfaces/ICommune'
import type { IDistrict } from '@/interfaces/IDistrict'
import type { IQuarter } from '@/interfaces/IQuarter'
import type { IRegion } from '@/interfaces/IRegion'
import { useCommuneStore } from '@/stores/Commune.store'
import { useDistrictStore } from '@/stores/District.store'
import { useQuarterStore } from '@/stores/Quarter.store'
import { useRegionStore } from '@/stores/Region.store'
import { ref } from 'vue'

const model = defineModel<boolean>()
const emits = defineEmits(['selectedLocation'])
const searchPayload = ref<string>('')

const $regionStore = useRegionStore()
const $districtStore = useDistrictStore()
const $communeStore = useCommuneStore()
const $quarterStore = useQuarterStore()
const regions = ref<IRegion[]>([])
const districts = ref<IDistrict[]>([])
const communes = ref<ICommune[]>([])
const quarters = ref<IQuarter[]>([])
const search = async () => {
  const payload = searchPayload.value.trim()
  regions.value = (await $regionStore.searchByName(payload)) as IRegion[]
  if (!payload) return

  districts.value = (await $districtStore.searchByName(payload)) as IDistrict[]
  communes.value = (await $communeStore.searchByName(payload)) as ICommune[]
  quarters.value = (await $quarterStore.searchByName(payload)) as IQuarter[]
}

const selectLocation = (
  type: 'REGION' | 'DISTRICT' | 'COMMUNE' | 'QUARTER',
  data: IRegion | IDistrict | ICommune | IQuarter,
) => {
  emits('selectedLocation', { type, data })
  model.value = false
}
</script>

<style scoped></style>
