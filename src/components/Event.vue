<template>
  <q-card flat bordered>
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
        <q-item-label class="text-grey">
          {{ status }}
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-img v-if="props.event.photo" :src="photo" :ratio="16 / 9" />
    <div class="row q-mx-xs">
      <p class="text-h6 text-bold">{{ event.title }}</p>
      <q-space />
      <p><q-icon name="place" color="red" />{{ province }}</p>
      <p>
        <q-icon name="calendar_month" />
        {{ new Date(event.startDate).toLocaleDateString() }}
      </p>
    </div>
    <q-card-actions>
      <q-btn no-caps flat color="positive" icon="receipt"
        >Acheter
        <span class="text-dark"
          >({{ props.event.price <= 0 ? 'gratuit' : props.event.price + 'ar' }})</span
        ></q-btn
      >
      <q-space />
      <q-btn
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
import isBetween from 'dayjs/plugin/isBetween'
import 'dayjs/locale/fr'

dayjs.extend(relativeTime)
dayjs.extend(isBetween)
dayjs.locale('fr')

const expanded = ref(false)
const props = defineProps<{ event: IEvent }>()

const photo = ref<string>(`${import.meta.env.VITE_API_URL}/${props.event.photo}`)
const location = props.event.location.split(',')
const province = ref<string>(location[0]!)

const getStatus = () => {
  let status = ''
  const currentDate = dayjs()
  if (currentDate.isBetween(dayjs(props.event.startDate), dayjs(props.event.endDate)))
    status = 'Encours'
  else if (currentDate.isBefore(dayjs(props.event.startDate))) status = 'À venir'
  else if (currentDate.isAfter(dayjs(props.event.startDate))) status = 'Términé'
  return status
}
const status = ref<string>(getStatus())

let createdAt = ref(dayjs(props.event.createdAt).fromNow())
setInterval(() => (createdAt.value = dayjs(props.event.createdAt).fromNow()), 1000 * 60)
</script>
