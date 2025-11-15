<template>
  <q-card flat bordered class="event-card">
    <q-item class="q-pa-none q-pt-xs q-pa-xs">
      <q-item-section class="text-bold">
        <q-item-label>
          <p class="text-bold">
            <span class="text-h6 text-bold">{{ event.title.toUpperCase() }}</span>
            <br /><span>
              <div class="text-caption text-grey-7">
                <q-icon name="place" size="16px" color="" class="q-mr-xs" />
                {{ province }}
                <span class="q-mx-sm">|</span>
                <q-icon name="calendar_month" size="16px" class="q-mr-xs" />
                {{ new Date(event.startDate).toLocaleDateString() }}
              </div>
            </span>
          </p>
        </q-item-label>
      </q-item-section>
      <q-space />
      <q-item-section class="text-right col-4 text-bold" style="justify-content: start">
        <q-chip
          style="padding: 15px"
          dense
          :color="
            eventStatus == 'UPCOMING'
              ? 'grey-5'
              : eventStatus == 'ONGOING'
                ? 'green-5'
                : eventStatus == 'CANCELLED'
                  ? 'red-5'
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
      </q-item-section>
    </q-item>

    <div class="q-pa-sm">
      <q-img v-if="props.event.photo" :src="photo" :ratio="16 / 9" class="rounded-borders">
        <div
          v-if="props.event.capacity && props.event.ticketAvailable! <= 20"
          class="absolute-bottom-right text-subtitle2 q-pa-sm"
        >
          <q-chip
            dense
            color="red-8"
            text-color="white"
            icon="confirmation_number"
            class="q-ma-none text-bold"
          >
            {{
              props.event.ticketAvailable! > 0
                ? `${props.event.ticketAvailable} billets restant`
                : 'Places complètes'
            }}
          </q-chip>
        </div>
      </q-img>
    </div>

    <q-item>
      <q-item-section avatar>
        <q-avatar size="48px">
          <img :src="profilePic" />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-subtitle1 text-bold">{{
          eventOwner?.firstName + ' ' + eventOwner?.lastName
        }}</q-item-label>
        <q-item-label caption> Posté {{ createdAt }} </q-item-label>
      </q-item-section>

      <q-item-section side class="text-right">
        <q-item-label class="text-h6 text-bold text-green-8">
          <q-icon name="payments" size="24px" class="q-mr-xs" />
          {{
            props.event.price <= 0
              ? 'Gratuit'
              : addSeparatorNumber(props.event.price, 3, ' ') + ' Ar'
          }}
        </q-item-label>
        <q-item-label caption class="text-subtitle2 text-bold">
          {{ event.category }}
        </q-item-label>
      </q-item-section>
    </q-item>

    <q-separator inset />

    <q-card-actions align="right" class="q-pt-md q-pb-md">
      <div v-if="$userStore.currentUser!.role == ERole.CLIENT">
        <q-btn
          v-if="props.event.capacity > 0 && props.event.ticketAvailable"
          no-caps
          rounded
          color="green-5"
          icon="receipt"
          label="Obtenir un billet"
          @click="() => (showPurchaseForm = true)"
        />
      </div>

      <div v-else-if="$userStore.currentUser?.role == ERole.ORGANIZER && props.event.price">
        <q-btn
          flat
          dense
          no-caps
          label="Participants"
          icon="group"
          :icon-right="expandedParticipants ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          @click="showParticipants"
        />
      </div>

      <q-space />

      <q-btn
        flat
        dense
        no-caps
        label="Détails"
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
        color="red-6"
        :loading="cancelLoading"
        @click="() => (showCancelConfirmation = true)"
      />
    </q-card-actions>

    <q-slide-transition>
      <div v-show="expandedDetails">
        <q-separator />
        <q-card-section>
          <p v-if="props.event.description" class="text-body2 text-grey-9 q-mb-md q-px-sm">
            {{ props.event.description }}
          </p>

          <q-list separator dense>
            <q-item class="q-px-sm">
              <q-item-section avatar>
                <q-icon name="map" color="teal-7" size="sm" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-bold">Lieu</q-item-label>
                <q-item-label caption>
                  Province : {{ province }}<br />
                  Région : {{ props.event.location.split(',')[1] }}<br />
                  District : {{ props.event.location.split(',')[2] }}<br />
                  Adresse : {{ props.event.address }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item class="q-px-sm">
              <q-item-section avatar>
                <q-icon name="schedule" color="teal-7" size="sm" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-bold">Date & Heure</q-item-label>
                <q-item-label caption>
                  Début : {{ new Date(props.event.startDate).toLocaleDateString() }} à
                  {{
                    new Date(props.event.startDate).getHours() +
                    'h' +
                    new Date(props.event.startDate).getMinutes().toString().padStart(2, '0')
                  }}<br />
                  Fin : {{ new Date(props.event.endDate).toLocaleDateString() }} à
                  {{
                    new Date(props.event.endDate).getHours() +
                    'h' +
                    new Date(props.event.endDate).getMinutes().toString().padStart(2, '0')
                  }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item class="q-px-sm" v-if="props.event.capacity">
              <q-item-section avatar>
                <q-icon name="groups" color="teal-7" size="sm" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-bold">Capacité</q-item-label>
                <q-item-label caption> {{ props.event.capacity }} place(s) </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </div>
    </q-slide-transition>

    <q-slide-transition>
      <div v-show="expandedParticipants">
        <q-separator />
        <q-card-section class="q-py-md" style="max-height: 250px; overflow: auto">
          <p v-if="ticketsForThis.length <= 0" class="text-center text-overline text-grey-6">
            Aucun participant pour cet événement
          </p>
          <q-list v-else separator>
            <q-item class="q-mb-sm text-bold text-subtitle2 text-teal-5">
              <q-item-section>Acheteur</q-item-section>
              <q-item-section side>Billets</q-item-section>
            </q-item>
            <q-item v-for="t in ticketsForThis" :key="t._id">
              <q-item-section avatar>
                <q-avatar size="32px">
                  <img :src="profilePic" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-bold">{{
                  (t.userId as IUser).firstName + ' ' + (t.userId as IUser)?.lastName
                }}</q-item-label>
                <q-item-label caption> {{ (t.userId as IUser).email }} </q-item-label>
              </q-item-section>
              <q-item-section side class="text-right text-bold text-h6 text-teal-5">
                {{ t.nbAdult + t.nbChild + t.nbSenior }}
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </div>
    </q-slide-transition>

    <purchase :event="props.event" v-model="showPurchaseForm" />

    <q-dialog v-model="showCancelConfirmation" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="event_busy" color="red" size="24px" class="q-mr-sm" />
          <span class="text-subtitle1">Voulez-vous vraiment annuler cet événement ?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat no-caps label="Non" color="grey" v-close-popup />
          <q-btn rounded no-caps label="Oui, annuler" color="red" @click="cancelEvent" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<style scoped>
.event-card {
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.06);
}

.rounded-borders {
  border-radius: 8px;
}

.q-list li {
  list-style: none;
}
</style>

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
