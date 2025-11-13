<template>
  <q-card flat bordered>
    <q-item>
      <q-item-section class="text-bold">
        <q-item-label>
          <p class="text-bold">
            <span class="q-ml-sm">{{ event.title.toUpperCase() }}</span> <br /><span>
              <q-chip
                dense
                :color="
                  eventStatus == 'UPCOMING'
                    ? 'grey'
                    : eventStatus == 'ONGOING'
                      ? 'green'
                      : eventStatus == 'CANCELLED'
                        ? 'red'
                        : 'black'
                "
                text-color="white"
                icon="event"
                >{{
                  eventStatus == 'UPCOMING'
                    ? 'À venir'
                    : eventStatus == 'ONGOING'
                      ? 'Encours'
                      : eventStatus == 'CANCELLED'
                        ? 'Annulé'
                        : 'Terminé'
                }}</q-chip
              >
              <q-chip
                v-if="props.event.capacity && props.event.ticketAvailable! <= 20"
                dense
                color="red"
                text-color="white"
                icon="event"
                >{{
                  props.event.ticketAvailable! > 0
                    ? `${props.event.ticketAvailable} billets restant `
                    : 'Place complet'
                }}</q-chip
              >
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
              : addSeparatorNumber(props.event.price, 3, ' ') + ' Ar'
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
          v-if="props.event.capacity > 0 && props.event.ticketAvailable"
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
          @click="showParticipants"
        />
      </div>
      <q-space />
      <div>
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
        <q-btn
          v-if="
            !props.event.cancelled &&
            $userStore.currentUser?.role == ERole.ORGANIZER &&
            props.event.status != 'ENDED'
          "
          outline
          no-caps
          label="Annuler"
          :loading="cancelLoading"
          @click="() => (showCancelConfirmation = true)"
        />
      </div>
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
        <q-card-section class="text-subtitle2" style="max-height: 250px; overflow: auto">
          <p v-if="ticketsForThis.length <= 0" class="text-center text-overline">
            Aucun participant pour cet événement
          </p>
          <div v-else>
            <q-item class="q-pa-none text-bold">
              <q-item-section>
                <q-item-label>Acheteur</q-item-label>
              </q-item-section>
              <q-space />
              <q-item-section>
                <q-item-label class="text-right">personne / billet</q-item-label>
              </q-item-section>
            </q-item>
            <q-list>
              <q-item v-for="t in ticketsForThis" class="q-pa-none">
                <q-item-section avatar>
                  <q-avatar>
                    <img :src="profilePic" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{
                    (t.userId as IUser).firstName + ' ' + (t.userId as IUser)?.lastName
                  }}</q-item-label>
                  <q-item-label caption> {{ (t.userId as IUser).email }} </q-item-label>
                </q-item-section>
                <q-space />
                <q-item-section class="text-right">
                  <q-item-label>{{ t.nbAdult + t.nbChild + t.nbSenior }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>
      </div>
    </q-slide-transition>

    <purchase :event="props.event" v-model="showPurchaseForm" />

    <q-dialog v-model="showCancelConfirmation" persistent>
      <q-card>
        <q-card-section>
          <q-icon name="event_busy" color="red" />
          Voulez-vous vraiment annuler cette événement ?
        </q-card-section>

        <q-card-actions align="right">
          <q-btn outline no-caps label="Non" color="grey" v-close-popup />
          <q-btn outline no-caps label="Oui" color="red" @click="cancelEvent" />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
import { useTicketStore } from '@/stores/Ticket.store'
import type { ITicket } from '@/interfaces/ITicket'
import { useEventStore } from '@/stores/Event.store'
import type { EventStatus } from '@/enums/EStatus'

dayjs.extend(relativeTime)
dayjs.extend(isBetween)
dayjs.locale('fr')

const props = defineProps<{ event: IEvent }>()
const $userStore = useUserStore()
const $eventStore = useEventStore()

const eventStatus = ref<EventStatus>(props.event.status!)
const eventOwner = ref<IUser | null>(null)
const $ticketStore = useTicketStore()
const ticketsForThis = ref<ITicket[]>([])
const showCancelConfirmation = ref<boolean>(false)
const cancelLoading = ref<boolean>(false)
const showPurchaseForm = ref<boolean>(false)
const expandedDetails = ref(false)
const expandedParticipants = ref(false)

const photo = computed<string>(() => `${import.meta.env.VITE_API_URL}/${props.event.photo}`)
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

const showParticipants = () => {
  expandedParticipants.value = !expandedParticipants.value
  expandedDetails.value = false
  if (expandedParticipants.value) {
    const tickets = $ticketStore.tickets.filter(
      (t) => t.eventId == props.event._id || (t.eventId as IEvent)._id == props.event._id,
    )
    ticketsForThis.value = tickets
  }
}

const cancelEvent = async () => {
  cancelLoading.value = true
  await $eventStore.cancelEvent(props.event._id!)
  cancelLoading.value = false
  showCancelConfirmation.value = false
}

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
