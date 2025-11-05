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
        <q-item-label caption> {{ createdAt }} </q-item-label>
      </q-item-section>
      <q-space />
      <q-item-section class="text-right text-bold">
        <q-item-label>
          <q-icon color="green-8" name="payments" />
          {{ props.event.price <= 0 ? 'gratuit' : props.event.price + 'ar' }}</q-item-label
        >
      </q-item-section>
    </q-item>
    <q-img v-if="props.event.photo" :src="photo" :ratio="16 / 9" />
    <div class="row items-center q-mx-xs">
      <p class="text-h6 text-bold"><q-icon name="event" />{{ event.title }}</p>
      <q-space />
      <p><q-icon name="place" color="red" />{{ province }}</p>
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
          {{ props.event.description }}
        </q-card-section>
      </div>
    </q-slide-transition>
  </q-card>
</template>
<script setup lang="ts">
import type { IEvent } from '@/interfaces/IEvent'
import { ref } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/fr'

dayjs.extend(relativeTime)
dayjs.locale('fr')

const expanded = ref(false)
const props = defineProps<{ event: IEvent }>()

const photo = ref<string>(`${import.meta.env.VITE_API_URL}/${props.event.photo}`)
const location = props.event.location.split(',')
const province = ref<string>(location[0]!)

const createdAt = dayjs(props.event.createdAt).fromNow()
</script>
