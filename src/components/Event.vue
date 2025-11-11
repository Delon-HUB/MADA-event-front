<template>
  <q-card flat bordered>
    <q-item>
      <q-item-section class="text-bold">
        <q-item-label>
          <p class="text-bold">
            {{ event.title }} <br /><span
              class="text-red text-caption"
              v-if="props.event.capacity && props.event.ticketAvailable! <= 10"
              >{{ props.event.ticketAvailable! > 0 ? +' billets restant' : 'Place complet' }}
            </span>
          </p>
        </q-item-label>
      </q-item-section>
      <q-space />
      <q-item-section class="text-right text-bold">
        <q-item-label>
          <q-icon name="payments" color="green" />{{
            props.event.price <= 0
              ? 'gratuit'
              : addSeparatorNumber(props.event.price, 3, '.') + ' Ar'
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
          <img :src="profilePic" />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label>{{ eventOwner?.firstName + ' ' + eventOwner?.lastName }}</q-item-label>
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
      <div v-if="$userStore.currentUser!.role == ERole.CLIENT">
        <q-btn
          v-if="props.event.price != 0 && props.event.ticketAvailable"
          no-caps
          flat
          color="positive"
          icon="receipt"
          @click="() => (showPurchaseForm = true)"
          >Obténir un billet</q-btn
        >
      </div>
      <div v-else-if="$userStore.currentUser?.role == ERole.ORGANIZER && props.event.price">
        <q-btn
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
      </div>
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
        <!-- <q-card-section class="text-subtitle2">
          <p v-if="props.event.participants?.length === 0" class="text-center text-overline">
            Aucun participant pour cet événement
          </p>
          <q-list v-else>
            <q-item v-for="user in props.event.participants">
              <q-item-section avatar>
                <q-avatar>
                  <img :src="profilePic" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ user.firstName + ' ' + user?.lastName }}</q-item-label>
                <q-item-label caption> {{ user.email }} </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section> -->
      </div>
    </q-slide-transition>

    <purchase :event="props.event" v-model="showPurchaseForm" />
  </q-card>
</template>
<script setup lang="ts">
import type { IEvent } from '@/interfaces/IEvent'
import Purchase from './Purchase.vue'
import { computed, onMounted, ref, watch } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isBetween from 'dayjs/plugin/isBetween'
import 'dayjs/locale/fr'
import { useUserStore } from '@/stores/User.store'
import { ERole } from '@/enums/ERole'
import { addSeparatorNumber } from '@/utils/utils'
import type { IUser } from '@/interfaces/IUser'

dayjs.extend(relativeTime)
dayjs.extend(isBetween)
dayjs.locale('fr')

const props = defineProps<{ event: IEvent }>()
const userRole = ref<string>()
const $userStore = useUserStore()
const eventOwner = ref<IUser | null>(null)

watch(
  () => $userStore.currentUser,
  () => (userRole.value = $userStore.currentUser!.role),
)
const showPurchaseForm = ref<boolean>(false)
const expandedDetails = ref(false)
const expandedParticipants = ref(false)

const photo = ref<string>(`${import.meta.env.VITE_API_URL}/${props.event.photo}`)
const location = props.event.location.split(',')
const province = ref<string>(location[0]!)

let createdAt = ref(dayjs(props.event.createdAt).fromNow())
setInterval(() => (createdAt.value = dayjs(props.event.createdAt).fromNow()), 1000 * 60)

onMounted(async () => {
  const owner = await $userStore.findUserById(props.event.ownerId! as string)
  if (owner) {
    eventOwner.value = owner
  }
})

const profilePic = computed(() => `${import.meta.env.VITE_API_URL + eventOwner.value?.photo}`)

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
