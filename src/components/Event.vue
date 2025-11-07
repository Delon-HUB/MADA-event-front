<template>
  <q-card flat bordered>
    <q-item>
      <q-item-section class="text-bold">
        <q-item-label>
          <p class="text-h6 text-bold">{{ event.title }}</p>
        </q-item-label>
      </q-item-section>
      <q-space />
      <q-item-section class="text-right text-bold">
        <q-item-label>
          <q-icon name="payments" color="green" />{{
            props.event.price <= 0 ? 'gratuit' : props.event.price + ' Ar'
          }}
        </q-item-label>
        <q-item-label caption>
          {{ event.category }}
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-img v-if="props.event.photo" :src="photo" :ratio="16 / 9" />

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
      <q-item-section class="text-right">
        <q-item-label> <q-icon name="place" color="red" />{{ province }} </q-item-label>
        <q-item-label overline class="text-bold">
          <q-icon name="calendar_month" />
          {{ new Date(event.startDate).toLocaleDateString() }}
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-card-actions>
      <q-btn
        v-if="$userStore.currentUser.role == ERole.CLIENT"
        no-caps
        flat
        color="positive"
        icon="receipt"
        @click="() => (showPurchageForm = true)"
        >Acheter</q-btn
      >
      <q-btn
        v-else
        flat
        dense
        no-caps
        label="Participants"
        :icon-right="expandedParticipants ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
        @click="
          () => {
            expandedParticipants = !expandedParticipants
            expandedDetails = false
          }
        "
      />
      <q-space />
      <q-btn
        flat
        dense
        no-caps
        label="détails"
        :icon="expandedDetails ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
        @click="
          () => {
            expandedDetails = !expandedDetails
            expandedParticipants = false
          }
        "
      />
    </q-card-actions>

    <q-slide-transition>
      <div v-show="expandedDetails">
        <q-separator />
        <q-card-section class="text-subtitle2"> détails... </q-card-section>
      </div>
    </q-slide-transition>
    <q-slide-transition>
      <div v-show="expandedParticipants">
        <q-separator />
        <q-card-section class="text-subtitle2"> Participants... </q-card-section>
      </div>
    </q-slide-transition>

    <purchase :event="props.event" v-model="showPurchageForm" />
  </q-card>
</template>
<script setup lang="ts">
import type { IEvent } from '@/interfaces/IEvent'
import Purchase from './Purchase.vue'
import { ref, watch } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isBetween from 'dayjs/plugin/isBetween'
import 'dayjs/locale/fr'
import { useUserStore } from '@/stores/User.store'
import { ERole } from '@/enums/ERole'

dayjs.extend(relativeTime)
dayjs.extend(isBetween)
dayjs.locale('fr')

const props = defineProps<{ event: IEvent }>()
const userRole = ref<string>()
const $userStore = useUserStore()
watch(
  () => $userStore.currentUser,
  () => (userRole.value = $userStore.currentUser.role),
)
const showPurchageForm = ref<boolean>(false)
const expandedDetails = ref(false)
const expandedParticipants = ref(false)

const photo = ref<string>(
  `${import.meta.env.VITE_API_URL}/${props.event.photo}?ngrok-skip-browser-warning=true`,
)
const location = props.event.location.split(',')
const province = ref<string>(location[0]!)

let createdAt = ref(dayjs(props.event.createdAt).fromNow())
setInterval(() => (createdAt.value = dayjs(props.event.createdAt).fromNow()), 1000 * 60)

console.log(props.event)

// const getImgAsBase64 = async () => {
//   const url = photo.value
//   const response = await fetch(url, {
//     headers: {
//       'ngrok-skip-browser-warning': 'skip-browser-warning',
//     },
//   })
//   const imgBlob = await response.blob()
//   const fileReader = new FileReader()
//   fileReader.readAsDataURL(imgBlob)
//   fileReader.onloadend = async () => {
//     photo.value = fileReader.result as string
//   }
// }

// getImgAsBase64()
</script>
