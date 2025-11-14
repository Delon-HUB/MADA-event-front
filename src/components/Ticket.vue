<template>
  <q-card flat>
    <q-card-section horizontal>
      <q-img class="col-5" :src="qrCode" />
      <q-card-section>
        <q-item-section class="text-bold">
          <q-item-label class="text-h6">
            {{ event?.title }}
          </q-item-label>
          <q-item-label class="text-bold">
            <q-icon size="24px" name="calendar_month" />
            {{ new Date(props.payment.createdAt!).toLocaleDateString() }}
          </q-item-label>
          <q-item-label>
            <q-icon size="24px" name="place" color="red" /> {{ event?.location?.split(',')[0] }}
          </q-item-label>
          <q-item-label>
            <q-img :ratio="4 / 4" width="24px" height="24px" :src="paymentMethodeLogo" />

            {{
              event?.price == 0
                ? 'gratuit'
                : 'montant : ' + addSeparatorNumber(payment.amount, 3, ' ') + 'Ar'
            }}
          </q-item-label>
          <q-item-label>
            <q-icon name="phone_enabled" size="24px" /> {{ payment.phoneNumber }}
          </q-item-label>
          <q-item-label>
            {{ ticket?.nbChild }}🧒🏻 + {{ ticket?.nbAdult }}👨🏻‍💼 + {{ ticket?.nbSenior }}👴🏻 =
            {{ ticket?.nbChild + ticket?.nbAdult + ticket?.nbSenior }}
          </q-item-label>
        </q-item-section>
      </q-card-section>
    </q-card-section>

    <q-separator />
    <q-card-actions>
      <q-btn
        v-if="props.payment.status == PaymentStatus.PAID"
        icon="download"
        outline
        dense
        no-caps
        label="PDF"
        color="green"
        @click="generatePDF"
      />
      <q-btn
        v-if="props.payment.status == PaymentStatus.PAID && dayBeforeStart >= 2"
        icon="account_balance_wallet"
        outline
        dense
        no-caps
        label="Rembourser"
        color="red"
        @click="getRefundAllowedAmount"
      />
      <q-chip
        dense
        color="red"
        text-color="white"
        icon="payments"
        v-if="props.payment.status == PaymentStatus.REFUNDED"
        >{{ addSeparatorNumber(props.payment.refundedAmount!, 3, ' ') }} Ar remboursé</q-chip
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

    <q-dialog v-model="showRefundConfirmation" persistent>
      <q-card>
        <q-card-section class="text-center">
          <q-icon name="payments" color="green" /><span class="text-bold"
            >Demmande de remboursement</span
          >
          <br />
          La somme remboursable est de
          <strong>{{ addSeparatorNumber(allowedAmount, 3, ' ') }} Ar</strong><br />
          Voulez-vous continuer ?
        </q-card-section>

        <q-card-actions align="center">
          <q-btn outline no-caps label="Non" color="grey" v-close-popup />
          <q-btn outline no-caps label="Oui" color="red" @click="requestRefund" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>
<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isBetween from 'dayjs/plugin/isBetween'
import 'dayjs/locale/fr'
import type { IEvent } from '@/interfaces/IEvent'
import jsPDF from 'jspdf'
import { addSeparatorNumber } from '@/utils/utils'
import type { IPayment } from '@/interfaces/IPayment'
import { useEventStore } from '@/stores/Event.store'
import type { ITicket } from '@/interfaces/ITicket'
import { PaymentStatus } from '@/enums/EStatus'
import { useTicketStore } from '@/stores/Ticket.store'

dayjs.extend(relativeTime)
dayjs.extend(isBetween)
dayjs.locale('fr')

const props = defineProps<{ payment: IPayment }>()
const showRefundConfirmation = ref<boolean>(false)
const allowedAmount = ref<number>(0)
const expanded = ref(false)
const $eventStore = useEventStore()
const $ticketStore = useTicketStore()

const event = ref<IEvent>()
const ticket = ref<ITicket>(props.payment.ticketId as ITicket)
const paymentMethodeLogo = computed(() => {
  if (props.payment.method == 'mvola')
    return 'https://wiya.info/media/cache/resolve/logo_img/uploads/images/sellers/wiya-logo-mvola-66390b305746c359318575.png'
  else if (props.payment.method == 'airtel-money')
    return 'https://univ-utb.com/wp-content/uploads/2016/10/AIRTELLOGO.png'
  else if (props.payment.method == 'orange-money')
    return 'https://images.seeklogo.com/logo-png/44/1/orange-money-logo-png_seeklogo-440383.png'
})

onBeforeMount(async () => {
  const eventId =
    typeof ticket.value.eventId == 'string'
      ? ticket.value.eventId
      : ((props.payment.ticketId as ITicket).eventId as IEvent)._id?.toString()
  if (typeof ticket.value.eventId == 'string') {
    event.value = await $eventStore.findById(eventId!)
  } else if (typeof ticket.value.eventId == 'object') event.value = ticket.value.eventId as IEvent
})
const qrCode = ref<string>(`${import.meta.env.VITE_API_URL}/${props.payment.qrCodeUrl}`)

const getRefundAllowedAmount = async () => {
  const res = await $ticketStore.getRefundAmount(props.payment._id!)
  allowedAmount.value = res.allowedAmount
  if (res.allowedAmount) showRefundConfirmation.value = true
}

const requestRefund = async () => {
  const response = await $ticketStore.acceptRefund(props.payment._id!)
  showRefundConfirmation.value = false
}

const getDayBeforeEventStarted = (startDate: Date) => {
  const oneDay = 1000 * 60 * 60 * 24
  const diffDays = Math.ceil((startDate.getTime() - new Date().getTime()) / oneDay)
  return diffDays
}

const dayBeforeStart = computed<number>(() =>
  (ticket.value.eventId as IEvent).startDate
    ? getDayBeforeEventStarted((ticket.value.eventId as IEvent).startDate)
    : 0,
)

const generatePDF = async () => {
  if (event.value?._id) {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a6',
    })

    const img = await fetch(qrCode.value, {
      headers: {
        'ngrok-skip-browser-warning': '69420',
      },
    })

    const imgBlob = await img.blob()
    const fileReader = new FileReader()
    fileReader.readAsDataURL(imgBlob)
    fileReader.onloadend = async () => {
      pdf.addImage(fileReader.result as string, 'PNG', 20, 20, 250, 250)
      pdf.text(`Ticket pour l'événement ${event.value!.title}`, 42, 270)
      pdf.text(`Le ${new Date(event.value!.startDate).toLocaleString()}`, 42, 290)

      pdf.save(`Billet-${event.value!.title}.pdf`)
    }
  }
}
</script>
