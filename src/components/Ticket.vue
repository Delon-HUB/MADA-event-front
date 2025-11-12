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
                : 'montant : ' + addSeparatorNumber(payment.amount, 3, '.') + 'Ar'
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
      <q-btn icon="download" flat dense no-caps label="PDF" color="green" @click="generatePDF" />
      <q-space />
      <q-btn
        flat
        dense
        no-caps
        label="détails de l'événement"
        :icon="expanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
        @click="expanded = !expanded"
      />
    </q-card-actions>
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

dayjs.extend(relativeTime)
dayjs.extend(isBetween)
dayjs.locale('fr')

const expanded = ref(false)
const props = defineProps<{ payment: IPayment }>()
const $eventStore = useEventStore()
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
